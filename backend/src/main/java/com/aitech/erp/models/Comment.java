package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "task_comments")
@Data
public class Comment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "task_id")
  @JsonIgnore
  private Task task;
  
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "author_id")
  private Employee author;
  
  private String content;
  private LocalDateTime createdAt = LocalDateTime.now();
}
