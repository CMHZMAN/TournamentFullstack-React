using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TournamentAPI.Data;
using TournamentAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add JWT Authentication
var jwtKey = "TournamentAPI-SecretKey-MinimumLengthFor256BitKey-SuperSecretAndLong";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "TournamentAPI",
        ValidAudience = "TournamentClient",
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ClockSkew = TimeSpan.FromSeconds(5) // Tillåt 5 sekunders skew för server-tids-osynkronisering
    };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsJsonAsync(new { error = "Invalid or expired token" });
        }
    };
});

// Add CORS support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add DbContext with SQL Server connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=MARCUSALPTOP\\SQLEXPRESS;Database=TournamentDB;Trusted_Connection=true;Encrypt=false;TrustServerCertificate=true;";

builder.Services.AddDbContext<TournamentContext>(options =>
    options.UseSqlServer(connectionString));

// Register services with appropriate lifetimes
builder.Services.AddScoped<ITournamentService, TournamentService>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddSingleton<RateLimitingService>();

// Add logging
builder.Services.AddLogging();

var app = builder.Build();

// Apply migrations automatically (with error handling)
try
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<TournamentContext>();
        db.Database.Migrate();
    }
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogWarning($"Database migration failed: {ex.Message}. Make sure your SQL Server is running and the connection string is correct.");
}

// Configure the HTTP request pipeline.
// Skip HTTPS redirection in development (local development uses HTTP)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Enable CORS
app.UseCors("AllowFrontend");

// Add Authentication and Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

