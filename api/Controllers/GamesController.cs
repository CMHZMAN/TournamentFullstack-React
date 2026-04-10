using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TournamentAPI.DTOs;
using TournamentAPI.Services;

namespace TournamentAPI.Controllers;

[ApiController]
[Route("api/tournaments/{tournamentId}/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly ITournamentService _tournamentService;
    private readonly RateLimitingService _rateLimitingService;
    private readonly ILogger<GamesController> _logger;

    public GamesController(
        IGameService gameService,
        ITournamentService tournamentService,
        RateLimitingService rateLimitingService,
        ILogger<GamesController> logger)
    {
        _gameService = gameService;
        _tournamentService = tournamentService;
        _rateLimitingService = rateLimitingService;
        _logger = logger;
    }

    /// <summary>
    /// Get the current user ID from JWT token
    /// </summary>
    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("sub");
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
        {
            return userId;
        }
        return null;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameResponseDTO>>> GetGames(int tournamentId)
    {
        // Verify tournament exists
        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        var games = await _gameService.GetAllAsync(tournamentId);
        return Ok(games);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GameResponseDTO>> GetGame(int tournamentId, int id)
    {
        // Verify tournament exists
        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        var game = await _gameService.GetByIdAsync(id);
        if (game == null || game.TournamentId != tournamentId)
        {
            return NotFound();
        }
        return Ok(game);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<GameResponseDTO>> CreateGame(
        int tournamentId,
        [FromBody] GameCreateDTO createDTO)
    {
        // Check rate limit
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        if (!_rateLimitingService.IsRequestAllowed(clientIp))
        {
            return StatusCode(429, new { error = "Too many requests" });
        }

        // Verify tournament exists
        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        // Validate that TournamentId matches the route parameter
        if (createDTO.TournamentId != tournamentId)
        {
            return BadRequest(new { error = "Tournament ID in body does not match route parameter" });
        }

        // Set the current user as the creator
        var userId = GetCurrentUserId();
        createDTO.CreatedByUserId = userId;

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var game = await _gameService.CreateAsync(createDTO);
            return CreatedAtAction(nameof(GetGame), new { tournamentId = tournamentId, id = game.Id }, game);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<GameResponseDTO>> UpdateGame(
        int tournamentId,
        int id,
        [FromBody] GameUpdateDTO updateDTO)
    {
        // Verify tournament exists
        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var game = await _gameService.UpdateAsync(id, updateDTO);
            
            // Verify the game belongs to this tournament
            if (game.TournamentId != tournamentId)
            {
                return NotFound();
            }
            
            return Ok(game);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteGame(int tournamentId, int id)
    {
        // Verify tournament exists
        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        // Verify game exists and belongs to this tournament
        var game = await _gameService.GetByIdAsync(id);
        if (game == null || game.TournamentId != tournamentId)
        {
            return NotFound();
        }

        // Check authorization: Admin can delete any game, User can only delete their own
        var isAdmin = User.IsInRole("Admin");
        var currentUserId = GetCurrentUserId();
        var isOwner = game.CreatedByUserId == currentUserId;

        if (!isAdmin && !isOwner)
        {
            return Forbid("You can only delete your own games");
        }

        var success = await _gameService.DeleteAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}
