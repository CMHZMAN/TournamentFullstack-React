namespace TournamentAPI.Models;

public class User
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Tournament> CreatedTournaments { get; set; } = new List<Tournament>();
}
