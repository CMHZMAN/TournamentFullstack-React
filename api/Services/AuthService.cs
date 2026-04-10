using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TournamentAPI.Data;
using TournamentAPI.DTOs;
using TournamentAPI.Models;

namespace TournamentAPI.Services;

public interface IAuthService
{
    Task<LoginResponseDTO> RegisterAsync(RegisterDTO dto);
    Task<LoginResponseDTO> LoginAsync(LoginDTO dto);
    string GenerateJwtToken(User user, List<string> roles);
}

public class AuthService : IAuthService
{
    private readonly TournamentContext _context;
    private readonly ILogger<AuthService> _logger;
    private readonly string _jwtKey = "TournamentAPI-SecretKey-MinimumLengthFor256BitKey-SuperSecretAndLong";
    private readonly string _jwtIssuer = "TournamentAPI";
    private readonly string _jwtAudience = "TournamentClient";

    public AuthService(TournamentContext context, ILogger<AuthService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<LoginResponseDTO> RegisterAsync(RegisterDTO dto)
    {
        // Check if user already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => 
            u.Username == dto.Username || u.Email == dto.Email);

        if (existingUser != null)
        {
            throw new InvalidOperationException("Username or email already exists");
        }

        // Create new user
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Assign "User" role by default
        var userRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
        if (userRole != null)
        {
            var userRoleAssignment = new UserRole
            {
                UserId = user.Id,
                RoleId = userRole.Id
            };
            _context.UserRoles.Add(userRoleAssignment);
            await _context.SaveChangesAsync();
        }

        var roles = new List<string> { "User" };
        var token = GenerateJwtToken(user, roles);

        return new LoginResponseDTO
        {
            Token = token,
            Username = user.Username,
            Roles = roles,
            UserId = user.Id
        };
    }

    public async Task<LoginResponseDTO> LoginAsync(LoginDTO dto)
    {
        // Find user
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Invalid username or password");
        }

        // Get user roles
        var roles = user.UserRoles.Select(ur => ur.Role?.Name ?? "User").ToList();
        if (roles.Count == 0)
        {
            roles.Add("User"); // Default role if none assigned
        }

        var token = GenerateJwtToken(user, roles);

        return new LoginResponseDTO
        {
            Token = token,
            Username = user.Username,
            Roles = roles,
            UserId = user.Id
        };
    }

    public string GenerateJwtToken(User user, List<string> roles)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_jwtKey);
        var key = new SymmetricSecurityKey(keyBytes);
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<System.Security.Claims.Claim>
        {
            new System.Security.Claims.Claim("sub", user.Id.ToString()),
            new System.Security.Claims.Claim("username", user.Username),
            new System.Security.Claims.Claim("email", user.Email)
        };

        // Add role claims
        foreach (var role in roles)
        {
            claims.Add(new System.Security.Claims.Claim("role", role));
        }

        var token = new JwtSecurityToken(
            issuer: _jwtIssuer,
            audience: _jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    private static bool VerifyPassword(string password, string hash)
    {
        var hashOfInput = HashPassword(password);
        return hashOfInput == hash;
    }
}
