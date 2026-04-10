namespace TournamentAPI.Models;

public class Role
{
    public int Id { get; set; }
    public required string Name { get; set; } // "Admin", "User"
    
    // Navigation property
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
