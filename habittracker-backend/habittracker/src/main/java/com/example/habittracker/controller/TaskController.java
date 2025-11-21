package com.example.habittracker.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.habittracker.dto.TaskRequestDTO;
import com.example.habittracker.dto.TaskResponseDTO;
import com.example.habittracker.model.User;
import com.example.habittracker.service.TaskService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getTasks() {
        return ResponseEntity.ok(taskService.getTasksByUserId(getAuthenticatedUserId()));
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> addTask(@RequestBody TaskRequestDTO taskRequestDTO) {
        TaskResponseDTO createdTask = taskService.createTask(taskRequestDTO, getAuthenticatedUserId());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @PatchMapping("{taskId}")
    public ResponseEntity<TaskResponseDTO> toogleTask(@PathVariable Long taskId,
            @RequestBody Map<String, Boolean> payload) {
        Boolean isCompleted = payload.get("completed");

        TaskResponseDTO updatedTask = taskService.toggleTaskStatus(taskId, isCompleted, getAuthenticatedUserId());
        return ResponseEntity.ok(updatedTask);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponseDTO> updateTask(@PathVariable Long taskId,
            @RequestBody TaskRequestDTO taskRequestDTO) {
        TaskResponseDTO updatedTask = taskService.updateTask(taskId, taskRequestDTO, getAuthenticatedUserId());
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId, getAuthenticatedUserId());
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
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
