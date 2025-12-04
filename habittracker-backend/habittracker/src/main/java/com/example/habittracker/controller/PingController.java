package com.example.habittracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    // Simples endpoint para verificar se o servidor está ativo
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
