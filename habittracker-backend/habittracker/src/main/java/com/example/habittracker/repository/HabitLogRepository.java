package com.example.habittracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.habittracker.model.HabitLog;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    List<HabitLog> findByHabitIdAndDateGreaterThanEqual(Long habitId, LocalDate date);

    Optional<HabitLog> findByHabitIdAndDate(Long habitId, LocalDate date);
}
