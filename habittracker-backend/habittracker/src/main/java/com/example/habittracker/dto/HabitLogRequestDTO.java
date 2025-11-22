package com.example.habittracker.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record HabitLogRequestDTO(
        @NotNull(message = "Date is required") LocalDate date,

        // Se for null, o service assume 1 (feito).
        // Se tiver valor (ex: 500ml), usa o valor.
        Integer value) {
}