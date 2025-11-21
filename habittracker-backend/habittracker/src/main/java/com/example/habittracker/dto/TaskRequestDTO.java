package com.example.habittracker.dto;

import java.time.Instant;

public record TaskRequestDTO(
        String title,
        String description,
        Boolean completed,
        Instant deadline) {
}