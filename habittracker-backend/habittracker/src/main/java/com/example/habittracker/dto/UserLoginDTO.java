package com.example.habittracker.dto;

import jakarta.validation.constraints.NotBlank;

public record UserLoginDTO(@NotBlank String email,
        @NotBlank String password) {

}
