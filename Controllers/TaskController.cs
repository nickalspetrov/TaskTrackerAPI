
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskApi.Models;
using TaskApi.Services;
using TaskApi.DTOs;

namespace TaskApi.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{

private readonly ITaskService _taskService;

public TasksController(ITaskService taskService)
{
    _taskService = taskService;
}


  
[HttpGet]
public async Task<ActionResult<List<TaskItem>>> GetTasks()
{
    var tasks = await _taskService.GetAllAsync();

    return Ok(tasks);
}




[HttpGet("{id:int}")]
public async Task<ActionResult<TaskItem>> GetTask(int id)
{
    var task = await _taskService.GetByIdAsync(id);

    if (task is null)
    {
        return NotFound();
    }

    return Ok(task);
}




[HttpPost]
public async Task<ActionResult<TaskItem>> CreateTask(
    [FromBody] CreateTaskDto dto)
{
    if (string.IsNullOrWhiteSpace(dto.Title))
    {
        return BadRequest("Title is required.");
    }

    if (dto.Status != "ToDo" &&
        dto.Status != "InProgress" &&
        dto.Status != "Done")
    {
        return BadRequest("Invalid task status.");
    }

    var task = new TaskItem
    {
        Title = dto.Title.Trim(),
        Description = dto.Description ?? "",
        Status = dto.Status,
        IsCompleted = dto.Status == "Done"
    };

    var createdTask = await _taskService.CreateAsync(task);

    return CreatedAtAction(
        nameof(GetTask),
        new { id = createdTask.Id },
        createdTask
    );
}



[HttpPut("{id:int}")]
public async Task<IActionResult> UpdateTask(
    int id,
    [FromBody] UpdateTaskDto dto)
{
    if (string.IsNullOrWhiteSpace(dto.Title))
    {
        return BadRequest("Title is required.");
    }

    if (dto.Status != "ToDo" &&
        dto.Status != "InProgress" &&
        dto.Status != "Done")
    {
        return BadRequest("Invalid task status.");
    }

    var updatedTask = new TaskItem
    {
        Title = dto.Title.Trim(),
        Description = dto.Description ?? "",
        Status = dto.Status,
        IsCompleted = dto.Status == "Done"
    };

    bool updated = await _taskService.UpdateAsync(
        id,
        updatedTask
    );

    if (!updated)
    {
        return NotFound();
    }

    return NoContent();
}


[HttpDelete("{id:int}")]
public async Task<IActionResult> DeleteTask(int id)
{
    bool deleted = await _taskService.DeleteAsync(id);

    if (!deleted)
    {
        return NotFound();
    }

    return NoContent();
}


}

