package com.example.habittracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record HabitRequestDTO(
                @NotBlank(message = "Name is mandatory") @Size(min = 1, max = 100) String name,

                String unit,
                String colorCode,
                Double goal) {
}