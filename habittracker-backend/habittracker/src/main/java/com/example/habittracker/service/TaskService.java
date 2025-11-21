package com.example.habittracker.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.habittracker.dto.TaskRequestDTO;
import com.example.habittracker.dto.TaskResponseDTO;
import com.example.habittracker.model.Task;
import com.example.habittracker.model.User;
import com.example.habittracker.repository.TaskRepository;
import com.example.habittracker.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<TaskResponseDTO> getTasksByUserId(Long userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);

        return tasks.stream()
                .map(TaskResponseDTO::new)
                .collect(Collectors.toList());
    }

    public TaskResponseDTO createTask(TaskRequestDTO taskDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Task task = new Task();
        task.setTitle(taskDTO.title());
        task.setDescription(taskDTO.description());
        task.setCompleted(taskDTO.completed() != null ? taskDTO.completed() : false);
        task.setDeadline(taskDTO.deadline());
        task.setUser(user);

        Task savedTask = taskRepository.save(task);
        return new TaskResponseDTO(savedTask);
    }

    public TaskResponseDTO updateTask(Long taskId, TaskRequestDTO taskDTO, Long userId) {
        Task existingTask = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found or access denied"));

        existingTask.setTitle(taskDTO.title());
        existingTask.setDescription(taskDTO.description());

        if (taskDTO.completed() != null) {
            existingTask.setCompleted(taskDTO.completed());
        }

        existingTask.setDeadline(taskDTO.deadline());

        Task savedTask = taskRepository.save(existingTask);
        return new TaskResponseDTO(savedTask);
    }

    public TaskResponseDTO toggleTaskStatus(Long taskId, Boolean isCompleted, Long userId) {
        Task existingTask = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        existingTask.setCompleted(isCompleted);
        return new TaskResponseDTO(taskRepository.save(existingTask));
    }

    public void deleteTask(Long taskId, Long userId) {
        if (!taskRepository.existsByIdAndUserId(taskId, userId)) {
            throw new EntityNotFoundException("Task not found or access denied");
        }
        taskRepository.deleteById(taskId);
    }

    // Auxiliar para pegar task por id
    public TaskResponseDTO getTaskById(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        return new TaskResponseDTO(task);
    }
}
