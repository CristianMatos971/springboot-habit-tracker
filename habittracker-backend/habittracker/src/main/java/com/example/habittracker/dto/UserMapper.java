package com.example.habittracker.dto;

import com.example.habittracker.model.User;

public class UserMapper {

    // Converte DTO de registro para entidade user
    public static User toEntity(UserRegisterDTO dto, String encodedPassword) {
        return new User(
                dto.name(),
                dto.email(),
                encodedPassword);
    }

    // Converte Entidade pega do banco para DTO de resposta
    public static UserResponseDTO toDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail());
    }

}
