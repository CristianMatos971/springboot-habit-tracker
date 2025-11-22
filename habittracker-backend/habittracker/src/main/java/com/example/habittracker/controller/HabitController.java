package com.example.habittracker.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.habittracker.dto.HabitDetailsDTO;
import com.example.habittracker.dto.HabitLogRequestDTO;
import com.example.habittracker.dto.HabitLogResponseDTO;
import com.example.habittracker.dto.HabitRequestDTO;
import com.example.habittracker.dto.HabitResponseDTO;
import com.example.habittracker.model.User;
import com.example.habittracker.service.HabitService;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/habits")
public class HabitController {
    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    public ResponseEntity<List<HabitResponseDTO>> getHabits() {
        Long userId = getAuthenticatedUserId();

        return ResponseEntity.ok(habitService.getHabitsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<HabitResponseDTO> createHabit(@Valid @RequestBody HabitRequestDTO habitRequestDTO) {
        Long userId = getAuthenticatedUserId();
        HabitResponseDTO createdHabit = habitService.createHabit(habitRequestDTO, userId);
        // Retorna 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(createdHabit);
    }

    @PutMapping("/{habitId}")
    public ResponseEntity<HabitResponseDTO> updateHabit(@PathVariable Long habitId,
            @Valid @RequestBody HabitRequestDTO habitRequestDTO) {
        Long userId = getAuthenticatedUserId();
        return ResponseEntity.ok(habitService.updateHabit(habitId, habitRequestDTO, userId));
    }

    @DeleteMapping("/{habitId}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long habitId) {
        Long userId = getAuthenticatedUserId();
        habitService.deleteHabit(habitId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{habitId}/logs")
    public ResponseEntity<HabitLogResponseDTO> logHabit(@PathVariable Long habitId,
            @Valid @RequestBody HabitLogRequestDTO habitLogRequestDTO) {
        Long userId = getAuthenticatedUserId();
        HabitLogResponseDTO logResponseDTO = habitService.logHabit(habitId, habitLogRequestDTO.value(),
                habitLogRequestDTO.date(), userId);

        return ResponseEntity.ok(logResponseDTO);
    }

    @DeleteMapping("/{habitId}/logs")
    public ResponseEntity<Void> deleteHabitLog(@PathVariable Long habitId,
            @RequestParam(value = "date", required = true) LocalDate date) {
        Long userId = getAuthenticatedUserId();
        habitService.deleteHabitLog(habitId, date, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{habitId}/logs")
    public ResponseEntity<HabitDetailsDTO> getHabitLogs(@PathVariable Long habitId,
            @RequestParam(value = "fromDate", required = false) LocalDate fromDate) {
        Long userId = getAuthenticatedUserId();

        if (fromDate == null) {
            fromDate = LocalDate.now().withDayOfYear(1);
        }

        HabitDetailsDTO habitDetailsDTO = habitService.getHabitLogs(habitId, fromDate, userId);
        return ResponseEntity.ok(habitDetailsDTO);
    }

    private Long getAuthenticatedUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof User userDetails) {
            return userDetails.getId();
        } else if (authentication != null && authentication.getPrincipal() instanceof Long id) {
            return id;
        }

        throw new RuntimeException("User not authenticated or invalid principal");
    }
}
