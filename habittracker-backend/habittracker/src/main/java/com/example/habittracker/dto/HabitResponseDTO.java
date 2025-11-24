package com.example.habittracker.dto;

import java.time.LocalDateTime;

import com.example.habittracker.model.Habit;

public record HabitResponseDTO(
        Long id,
        String name,
        String unit,
        String colorCode,
        Double goal,
        LocalDateTime createdAt) {

    // Construtor auxiliar para converter Entity para DTO
    public HabitResponseDTO(Habit habit) {
        this(
                habit.getId(),
                habit.getName(),
                habit.getUnit(),
                habit.getColorCode(),
                habit.getGoal(),
                habit.getCreatedAt());
    }
}
