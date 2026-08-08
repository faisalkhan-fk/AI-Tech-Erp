package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Entity
@Table(name = "attendance")
@Data
public class Attendance {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "employee_id")
  private Employee employee;
  private LocalDate date;
  private LocalTime checkIn;
  private LocalTime checkOut;
  private String status;
  private Double workingHours;
}