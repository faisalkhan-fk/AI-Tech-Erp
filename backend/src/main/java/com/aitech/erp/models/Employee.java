package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "employees")
@Data
public class Employee {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @OneToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id")
  private User user;
  private String firstName;
  private String lastName;
  private String email;
  private String phone;
  private String designation;
  private String profilePic;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "department_id")
  private Department department;
}