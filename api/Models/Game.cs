namespace TournamentAPI.Models;

public class Game
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public DateTime Time { get; set; }

    // Foreign key - Tournament
    public int TournamentId { get; set; }

    // Foreign key - Who created this game
    public int? CreatedByUserId { get; set; }

    // Navigation properties
    public required Tournament Tournament { get; set; }
    public User? CreatedByUser { get; set; }
}
