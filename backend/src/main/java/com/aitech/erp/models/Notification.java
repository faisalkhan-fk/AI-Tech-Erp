package com.aitech.erp.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private String message;
    private String type; // TASK, LEAVE, ATTENDANCE, PROJECT, SYSTEM
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
