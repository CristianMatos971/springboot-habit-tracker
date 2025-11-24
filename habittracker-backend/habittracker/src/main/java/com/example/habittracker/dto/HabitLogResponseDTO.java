package com.example.habittracker.dto;

import com.example.habittracker.model.HabitLog;
import java.time.LocalDate;

public record HabitLogResponseDTO(
        Long id,
        LocalDate date,
        Double value) {
    public HabitLogResponseDTO(HabitLog log) {
        this(log.getId(), log.getDate(), log.getValue());
    }
}