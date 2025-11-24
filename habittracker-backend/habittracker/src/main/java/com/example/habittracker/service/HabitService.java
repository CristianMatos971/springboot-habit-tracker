package com.example.habittracker.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.example.habittracker.dto.HabitDetailsDTO;
import com.example.habittracker.dto.HabitLogResponseDTO;
import com.example.habittracker.dto.HabitRequestDTO;
import com.example.habittracker.dto.HabitResponseDTO;
import com.example.habittracker.model.Habit;
import com.example.habittracker.model.HabitLog;
import com.example.habittracker.model.User;
import com.example.habittracker.repository.HabitLogRepository;
import com.example.habittracker.repository.HabitRepository;
import com.example.habittracker.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class HabitService {

        private final HabitRepository habitRepository;
        private final UserRepository userRepository;
        private final HabitLogRepository habitLogRepository;

        public HabitService(HabitRepository habitRepository, UserRepository userRepository,
                        HabitLogRepository habitLogRepository) {
                this.habitRepository = habitRepository;
                this.userRepository = userRepository;
                this.habitLogRepository = habitLogRepository;
        }

        // Métodos para gerenciar hábitos (criar, atualizar, deletar, buscar)

        public HabitResponseDTO createHabit(HabitRequestDTO habitDTO, Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));

                Habit habit = new Habit();
                habit.setName(habitDTO.name());
                habit.setUnit(habitDTO.unit());
                habit.setColorCode(habitDTO.colorCode());
                habit.setGoal(habitDTO.goal());
                habit.setUser(user);

                Habit savedHabit = habitRepository.save(habit);
                return new HabitResponseDTO(savedHabit);
        }

        public HabitResponseDTO updateHabit(Long habitId, HabitRequestDTO habitDTO, Long userId) {
                Habit existingHabit = habitRepository.findByIdAndUserId(habitId, userId)
                                .orElseThrow(() -> new EntityNotFoundException("Habit not found or access denied"));

                existingHabit.setName(habitDTO.name());
                existingHabit.setUnit(habitDTO.unit());
                existingHabit.setColorCode(habitDTO.colorCode());
                existingHabit.setGoal(habitDTO.goal());

                Habit updatedHabit = habitRepository.save(existingHabit);
                return new HabitResponseDTO(updatedHabit);
        }

        public void deleteHabit(Long habitId, Long userId) {
                Habit existingHabit = habitRepository.findByIdAndUserId(habitId, userId)
                                .orElseThrow(() -> new EntityNotFoundException("Habit not found or access denied"));

                habitRepository.delete(existingHabit);
        }

        public List<HabitResponseDTO> getHabitsByUserId(Long userId) {
                List<Habit> habits = habitRepository.findByUserId(userId);

                return habits.stream()
                                .map(HabitResponseDTO::new)
                                .toList();
        }

        // Métodos para gerenciar logs de hábitos

        public HabitLogResponseDTO logHabit(Long habitId, Double value, LocalDate date, Long userId) {
                Habit habit = habitRepository.findByIdAndUserId(habitId, userId)
                                .orElseThrow(() -> new EntityNotFoundException("Habit not found or access denied"));

                HabitLog habitLog = habitLogRepository.findByHabitIdAndDate(habitId, date)
                                .orElseGet(() -> {
                                        HabitLog newLog = new HabitLog();
                                        newLog.setDate(date);
                                        newLog.setHabit(habit);
                                        return newLog;
                                });

                habitLog.setValue(value);

                HabitLog savedLog = habitLogRepository.save(habitLog);
                return new HabitLogResponseDTO(savedLog);
        }

        public void deleteHabitLog(Long habitId, LocalDate date, Long userId) {
                habitRepository.findByIdAndUserId(habitId, userId)
                                .orElseThrow(() -> new EntityNotFoundException("Habit not found or access denied"));

                HabitLog log = habitLogRepository.findByHabitIdAndDate(habitId, date)
                                .orElseThrow(() -> new EntityNotFoundException("Log not found for this date"));

                habitLogRepository.delete(log);
        }

        public HabitDetailsDTO getHabitLogs(Long habitId, LocalDate fromDate, Long userId) {
                Habit habit = habitRepository.findByIdAndUserId(habitId, userId)
                                .orElseThrow(() -> new EntityNotFoundException("Habit not found or access denied"));

                List<HabitLog> logs = habitLogRepository.findByHabitIdAndDateGreaterThanEqual(habitId, fromDate);

                Map<LocalDate, Double> historyMap = logs.stream()
                                .collect(Collectors.toMap(
                                                HabitLog::getDate,
                                                HabitLog::getValue));

                double sum = logs.stream()
                                .mapToDouble(HabitLog::getValue)
                                .sum();

                int totalEntries = logs.size();

                // Média só dos dias preenchidos
                double average = totalEntries > 0 ? sum / totalEntries : 0.0;

                // Cálculo dos streaks:
                // Ordena crescente
                List<LocalDate> sortedDates = historyMap.keySet().stream()
                                .sorted()
                                .toList();

                // ---- MAX STREAK ----
                int maxStreak = 0;
                int tempStreak = 0;
                LocalDate prev = null;

                for (LocalDate date : sortedDates) {

                        Double value = historyMap.get(date);
                        boolean completed = value != null && value > 0;

                        if (completed) {

                                if (prev != null && prev.plusDays(1).equals(date)) {
                                        tempStreak++;
                                } else {
                                        tempStreak = 1;
                                }

                                maxStreak = Math.max(maxStreak, tempStreak);

                        } else {
                                tempStreak = 0;
                        }

                        prev = date;
                }

                // ---- CURRENT STREAK ----
                int currentStreak = 0;
                LocalDate today = LocalDate.now();
                LocalDate pointer = today;

                while (historyMap.containsKey(pointer)
                                && historyMap.get(pointer) > 0) {

                        currentStreak++;
                        pointer = pointer.minusDays(1);
                }

                return new HabitDetailsDTO(
                                habit.getId(),
                                habit.getName(),
                                habit.getUnit(),
                                habit.getColorCode(),
                                habit.getGoal(),
                                average,
                                currentStreak,
                                maxStreak,
                                historyMap);
        }

}
