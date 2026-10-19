
using Microsoft.EntityFrameworkCore;
using TaskApi.Data;
using TaskApi.Models;


namespace TaskApi.Services;

public class TaskService : ITaskService
{
    private readonly AppDbContext _db;

    public TaskService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TaskItem>> GetAllAsync()
    {
        return await _db.Tasks
            .AsNoTracking()
            .OrderBy(t => t.Id)
            .ToListAsync();
    }

    public async Task<TaskItem?> GetByIdAsync(int id)
    {
        return await _db.Tasks
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);
    }
    
    public async Task<TaskItem> CreateAsync(TaskItem task)
{
    _db.Tasks.Add(task);

    await _db.SaveChangesAsync();

    return task;
}

    
public async Task<bool> UpdateAsync(
    int id,
    TaskItem updatedTask)
{
    var task = await _db.Tasks.FindAsync(id);

    if (task == null)
    {
        return false;
    }

    task.Title = updatedTask.Title.Trim();
    task.Description = updatedTask.Description ?? "";
    task.Status = updatedTask.Status;
    task.IsCompleted = updatedTask.Status == "Done";

    await _db.SaveChangesAsync();

    return true;
}

public async Task<bool> DeleteAsync(int id)
{
    var task = await _db.Tasks.FindAsync(id);

    if (task == null)
    {
        return false;
    }

    _db.Tasks.Remove(task);

    await _db.SaveChangesAsync();

    return true;
}

}
