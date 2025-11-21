package com.example.habittracker.repository;

import com.example.habittracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // O Spring cria o SQL automaticamente baseado no nome do método
    // "FindBy" + "User" (nome do campo na classe Task) + "Id"
    List<Task> findByUserId(Long userId);

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);
}