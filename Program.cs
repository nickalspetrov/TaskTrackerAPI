using TaskApi.Models;
using Microsoft.EntityFrameworkCore;
using TaskApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapGet("/api/hello", () =>
{
    return "Hello from Task Tracker API!";
});

app.MapGet("/api/tasks", async (AppDbContext db) =>
{
    var tasks = await db.Tasks
        .AsNoTracking()
        .OrderBy(t => t.Id)
        .ToListAsync();

    return Results.Ok(tasks);
});

app.MapPost("/api/tasks", async (TaskItem task, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(task.Title))
    {
        return Results.BadRequest("Title is required.");
    }

    db.Tasks.Add(task);

    await db.SaveChangesAsync();

    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.MapGet("/api/tasks/{id:int}", async (int id, AppDbContext db) =>
{
    TaskItem? task = await db.Tasks.FindAsync(id);

    if (task == null)
    {
        return Results.NotFound("Task not found.");
    }

    return Results.Ok(task);
});

app.MapPut("/api/tasks/{id:int}",
    async (int id, TaskItem updatedTask, AppDbContext db) =>
{
    // Търсим съществуващата задача
    var task = await db.Tasks.FindAsync(id);

    if (task == null)
    {
        return Results.NotFound("Task not found.");
    }

    // Проверяваме новото заглавие
    if (string.IsNullOrWhiteSpace(updatedTask.Title))
    {
        return Results.BadRequest("Title is required.");
    }

    // Променяме данните
    task.Title = updatedTask.Title;
    task.Description = updatedTask.Description;
    task.IsCompleted = updatedTask.IsCompleted;

    // Записваме промените в SQLite
    await db.SaveChangesAsync();

    return Results.Ok(task);
});

app.MapDelete("/api/tasks/{id:int}",
    async (int id, AppDbContext db) =>
{
    // Търсим задачата по ID
    var task = await db.Tasks.FindAsync(id);

    if (task == null)
    {
        return Results.NotFound("Task not found.");
    }

    // Изтриваме задачата
    db.Tasks.Remove(task);

    // Записваме промяната в SQLite
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();


record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
