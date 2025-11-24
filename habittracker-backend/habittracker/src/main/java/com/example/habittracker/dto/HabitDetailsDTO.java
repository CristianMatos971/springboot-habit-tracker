package com.example.habittracker.dto;

import java.time.LocalDate;
import java.util.Map;

public record HabitDetailsDTO(
        Long id,
        String name,
        String unit,
        String colorCode,
        Double goal,
        Double AveragePerDay,
        Integer currentStreak,
        Integer maxStreak,
        // Chave = Data (2025-11-22)
        // Valor = Quanto fez (1 ou 1000ml)
        Map<LocalDate, Double> history) {
}