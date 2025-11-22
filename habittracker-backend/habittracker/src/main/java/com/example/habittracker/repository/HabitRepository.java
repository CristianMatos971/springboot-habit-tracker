package com.example.habittracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.habittracker.model.Habit;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserId(Long userId);

    Optional<Habit> findByIdAndUserId(Long habitId, Long userId);
}