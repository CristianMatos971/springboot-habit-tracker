package com.example.habittracker.dto;

import java.time.Instant;
import com.example.habittracker.model.Task;

public record TaskResponseDTO(
        Long id,
        String title,
        String description,
        Boolean completed,
        Instant deadline,
        Instant createdAt) {
    // Construtor auxiliar para converter Entity para DTO
    public TaskResponseDTO(Task task) {
        this(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getCompleted(),
                task.getDeadline(),
                task.getCreatedAt());
    }
}