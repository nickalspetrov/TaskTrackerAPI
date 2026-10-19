
using System.ComponentModel.DataAnnotations;

namespace TaskApi.DTOs;

public class UpdateTaskDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(100,
        ErrorMessage = "Title cannot exceed 100 characters.")]
    public string Title { get; set; } = "";

    [StringLength(2000,
        ErrorMessage = "Description cannot exceed 2000 characters.")]
    public string Description { get; set; } = "";

    [Required]
    [RegularExpression(
        "^(ToDo|InProgress|Done)$",
        ErrorMessage = "Invalid task status.")]
    public string Status { get; set; } = "ToDo";
}
