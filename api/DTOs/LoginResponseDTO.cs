namespace TournamentAPI.DTOs;

public class LoginResponseDTO
{
    public required string Token { get; set; }
    public required string Username { get; set; }
    public required List<string> Roles { get; set; }
    public int UserId { get; set; }
}
