package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
@Entity
@Table(name = "projects")
@Data
public class Project {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private String description;
  private LocalDate startDate;
  private LocalDate endDate;
  private String status; // PENDING, IN_PROGRESS, COMPLETED

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "project_members",
      joinColumns = @JoinColumn(name = "project_id"),
      inverseJoinColumns = @JoinColumn(name = "employee_id")
  )
  private java.util.Set<Employee> teamMembers = new java.util.HashSet<>();
}