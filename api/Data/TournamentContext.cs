using Microsoft.EntityFrameworkCore;
using TournamentAPI.Models;

namespace TournamentAPI.Data;

public class TournamentContext : DbContext
{
    public TournamentContext(DbContextOptions<TournamentContext> options) : base(options)
    {
    }

    public DbSet<Tournament> Tournaments { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Configure Role
        modelBuilder.Entity<Role>()
            .HasKey(r => r.Id);

        modelBuilder.Entity<Role>()
            .HasIndex(r => r.Name)
            .IsUnique();

        // Configure UserRole (junction table)
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Tournament
        modelBuilder.Entity<Tournament>()
            .HasKey(t => t.Id);

        modelBuilder.Entity<Tournament>()
            .Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(100);

        modelBuilder.Entity<Tournament>()
            .Property(t => t.Description)
            .HasMaxLength(500);

        modelBuilder.Entity<Tournament>()
            .HasOne(t => t.CreatedByUser)
            .WithMany(u => u.CreatedTournaments)
            .HasForeignKey(t => t.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict); // Don't allow deleting user if they created tournaments

        // Configure Game
        modelBuilder.Entity<Game>()
            .HasKey(g => g.Id);

        modelBuilder.Entity<Game>()
            .Property(g => g.Title)
            .IsRequired()
            .HasMaxLength(100);

        // Configure foreign key and cascade delete
        modelBuilder.Entity<Game>()
            .HasOne(g => g.Tournament)
            .WithMany(t => t.Games)
            .HasForeignKey(g => g.TournamentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Game creator relationship
        modelBuilder.Entity<Game>()
            .HasOne(g => g.CreatedByUser)
            .WithMany()
            .HasForeignKey(g => g.CreatedByUserId)
            .OnDelete(DeleteBehavior.SetNull); // Set to NULL if user is deleted

        // Seed initial roles
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "User" }
        );
    }
}
