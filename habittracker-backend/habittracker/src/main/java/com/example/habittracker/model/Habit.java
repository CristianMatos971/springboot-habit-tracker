package com.example.habittracker.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "habits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Ex: "ml", "minutos", "km", "páginas". Se for null, é apenas Check (Sim/Não)
    private String unit;

    // Ex: "#4F46E5"
    private String colorCode;

    // Meta diária opcional (ex: meta é 2000ml, mas hoje fiz 1500ml)
    private Double goal;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // CascadeType.ALL: Se deletar o Hábito, deleta todos os logs dele.
    // orphanRemoval = true: Se remover um log da lista, ele sai do banco.
    @OneToMany(mappedBy = "habit", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Impede que o JSON tente serializar todos os logs ao buscar o Hábito
    @Builder.Default
    private List<HabitLog> logs = new ArrayList<>();
}