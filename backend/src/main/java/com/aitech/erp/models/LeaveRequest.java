package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
@Entity
@Table(name = "leaves")
@Data
public class LeaveRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "employee_id")
  private Employee employee;
  private LocalDate startDate;
  private LocalDate endDate;
  private String type; // SICK, CASUAL, ANNUAL
  private String status; // PENDING, APPROVED, REJECTED
  private String reason;
}