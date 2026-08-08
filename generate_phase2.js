const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Faisal Khan\\.gemini\\antigravity-ide\\scratch\\ai-tech-erp\\backend\\src\\main\\java\\com\\aitech\\erp";

const files = {
  "models/Department.java": `package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "departments")
@Data
public class Department {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
}`,

  "models/Employee.java": `package com.aitech.erp.models;
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
}`,

  "models/Attendance.java": `package com.aitech.erp.models;
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
}`,

  "repository/DepartmentRepository.java": `package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Department;
public interface DepartmentRepository extends JpaRepository<Department, Long> {}`,

  "repository/EmployeeRepository.java": `package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Employee;
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
  Employee findByUserId(Long userId);
}`,

  "repository/AttendanceRepository.java": `package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Attendance;
import java.util.List;
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
  List<Attendance> findByEmployeeId(Long employeeId);
}`,

  "controllers/EmployeeController.java": `package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.Employee;
import com.aitech.erp.repository.EmployeeRepository;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
  @Autowired
  EmployeeRepository employeeRepository;

  @GetMapping
  @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
  public List<Employee> getAllEmployees() {
    return employeeRepository.findAll();
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public Employee createEmployee(@RequestBody Employee employee) {
    return employeeRepository.save(employee);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
    return employeeRepository.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
    employeeRepository.deleteById(id);
    return ResponseEntity.ok().build();
  }
}`,

  "controllers/AttendanceController.java": `package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.Attendance;
import com.aitech.erp.repository.AttendanceRepository;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
  @Autowired
  AttendanceRepository attendanceRepository;

  @GetMapping
  public List<Attendance> getAllAttendance() {
    return attendanceRepository.findAll();
  }

  @GetMapping("/employee/{empId}")
  public List<Attendance> getAttendanceByEmployee(@PathVariable Long empId) {
    return attendanceRepository.findByEmployeeId(empId);
  }

  @PostMapping("/checkin")
  public Attendance checkIn(@RequestBody Attendance attendance) {
    attendance.setCheckIn(LocalTime.now());
    attendance.setDate(LocalDate.now());
    attendance.setStatus("PRESENT");
    return attendanceRepository.save(attendance);
  }

  @PostMapping("/checkout/{id}")
  public ResponseEntity<Attendance> checkOut(@PathVariable Long id) {
    return attendanceRepository.findById(id).map(record -> {
      record.setCheckOut(LocalTime.now());
      // Calculate basic working hours (simplified)
      java.time.Duration duration = java.time.Duration.between(record.getCheckIn(), record.getCheckOut());
      record.setWorkingHours(duration.toMinutes() / 60.0);
      return ResponseEntity.ok(attendanceRepository.save(record));
    }).orElse(ResponseEntity.notFound().build());
  }
}`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log("Phase 2 backend files generated successfully.");
