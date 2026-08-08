package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
@Entity
@Table(name = "tasks")
@Data
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "project_id")
  private Project project;
  private String title;
  private String description;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "assigned_to")
  private Employee assignedTo;
  private String status;
  private String priority;
  private LocalDate dueDate;
  
  @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
  private java.util.List<Comment> comments = new java.util.ArrayList<>();

  @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
  private java.util.List<Attachment> attachments = new java.util.ArrayList<>();
}