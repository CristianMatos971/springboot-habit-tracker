package com.example.habittracker.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.habittracker.dto.AuthResponseDTO;
import com.example.habittracker.dto.UserLoginDTO;
import com.example.habittracker.dto.UserMapper;
import com.example.habittracker.dto.UserRegisterDTO;
import com.example.habittracker.model.User;
import com.example.habittracker.repository.UserRepository;
import com.example.habittracker.security.jwt.JwtService;

@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(PasswordEncoder passwordEncoder, UserRepository userRepository, JwtService jwtService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO register(UserRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Email already registered");
        }

        String hash = passwordEncoder.encode(dto.password());
        User user = UserMapper.toEntity(dto, hash);
        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthResponseDTO(token, UserMapper.toDTO(user));
    }

    public AuthResponseDTO login(UserLoginDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Invalid Credentials"));

        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new RuntimeException("Invalid Credentials");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponseDTO(token, UserMapper.toDTO(user));
    }

}