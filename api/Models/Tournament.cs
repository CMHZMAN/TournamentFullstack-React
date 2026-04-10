namespace TournamentAPI.Models;

public class Tournament
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int MaxPlayers { get; set; }
    public DateTime Date { get; set; }

    // Foreign key - Who created this tournament (nullable for migration)
    public int? CreatedByUserId { get; set; }

    // Navigation properties
    public ICollection<Game> Games { get; set; } = new List<Game>();
    public User? CreatedByUser { get; set; }
}
