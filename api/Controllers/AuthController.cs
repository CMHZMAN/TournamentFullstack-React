using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TournamentAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;

    public AuthController(ILogger<AuthController> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    /// <summary>
    /// Login endpoint - Returns a JWT token
    /// For this school project, we accept any username/password combination
    /// </summary>
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest loginRequest)
    {
        if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
        {
            return BadRequest(new { error = "Användarnamn och lösenord är obligatoriska" });
        }

        // For school project: Accept any non-empty username/password
        // In production, verify against a user database
        if (string.IsNullOrWhiteSpace(loginRequest.Username) || loginRequest.Username.Length < 2)
        {
            return BadRequest(new { error = "Användarnamn måste vara minst 2 tecken" });
        }

        if (string.IsNullOrWhiteSpace(loginRequest.Password) || loginRequest.Password.Length < 3)
        {
            return BadRequest(new { error = "Lösenord måste vara minst 3 tecken" });
        }

        try
        {
            var token = GenerateJwtToken(loginRequest.Username);
            _logger.LogInformation($"User '{loginRequest.Username}' logged in successfully");

            return Ok(new
            {
                token = token,
                username = loginRequest.Username,
                message = "Inloggning lyckades"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Login error: {ex.Message}");
            return StatusCode(500, new { error = "Inloggning misslyckades. Försök igen senare." });
        }
    }

    /// <summary>
    /// Generate JWT Token
    /// </summary>
    private string GenerateJwtToken(string username)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TournamentAPI-SecretKey-MinimumLengthFor256BitKey-SuperSecretAndLong"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("sub", username),
            new Claim("name", username),
            new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            new Claim("exp", DateTimeOffset.UtcNow.AddHours(24).ToUnixTimeSeconds().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: "TournamentAPI",
            audience: "TournamentClient",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

/// <summary>
/// Login request DTO
/// </summary>
public class LoginRequest
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
