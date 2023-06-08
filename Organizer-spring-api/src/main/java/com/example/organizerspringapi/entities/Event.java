package com.example.organizerspringapi.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private String color;

    public Event(User user, String title, LocalDateTime start, LocalDateTime end, String color) {
        this.user = user;
        this.title = title;
        this.start = start;
        this.end = end;
        this.color = color;
    }
}