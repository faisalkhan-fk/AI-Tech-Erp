package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "task_attachments")
@Data
public class Attachment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "task_id")
  @JsonIgnore
  private Task task;
  
  private String fileName;
  private String fileType;
  private String filePath;
  private Long fileSize;
}
