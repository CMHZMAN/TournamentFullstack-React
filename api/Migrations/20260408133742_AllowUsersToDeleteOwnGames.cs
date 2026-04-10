using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TournamentAPI.Migrations
{
    /// <inheritdoc />
    public partial class AllowUsersToDeleteOwnGames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Games",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Games_CreatedByUserId",
                table: "Games",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Users_CreatedByUserId",
                table: "Games",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Users_CreatedByUserId",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_CreatedByUserId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Games");
        }
    }
}
