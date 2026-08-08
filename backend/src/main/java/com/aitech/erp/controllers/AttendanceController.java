package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.Attendance;
import com.aitech.erp.repository.AttendanceRepository;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.aitech.erp.repository.EmployeeRepository;
import com.aitech.erp.models.Employee;
import com.aitech.erp.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
  @Autowired AttendanceRepository attendanceRepository;
  @Autowired EmployeeRepository employeeRepository;

  private Employee getCurrentEmployee() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) {
      Long userId = ((UserDetailsImpl) auth.getPrincipal()).getId();
      return employeeRepository.findByUserId(userId);
    }
    return null;
  }

  private boolean isAdminOrManager() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth != null) {
      return auth.getAuthorities().stream()
          .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_MANAGER"));
    }
    return false;
  }

  @GetMapping
  public ResponseEntity<List<Attendance>> getAllAttendance() {
    if (isAdminOrManager()) {
      return ResponseEntity.ok(attendanceRepository.findAll());
    } else {
      Employee emp = getCurrentEmployee();
      if (emp != null) {
        return ResponseEntity.ok(attendanceRepository.findByEmployeeId(emp.getId()));
      }
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/employee/{empId}")
  public List<Attendance> getAttendanceByEmployee(@PathVariable Long empId) {
    return attendanceRepository.findByEmployeeId(empId);
  }

  @PostMapping("/checkin")
  public ResponseEntity<?> checkIn(@RequestBody(required = false) Attendance attendance) {
    Employee emp = getCurrentEmployee();
    if (emp == null) return ResponseEntity.badRequest().build();

    Attendance existing = attendanceRepository.findByEmployeeIdAndDate(emp.getId(), LocalDate.now());
    if (existing != null) {
        return ResponseEntity.badRequest().body("Already checked in today.");
    }

    if (attendance == null) {
      attendance = new Attendance();
    }
    attendance.setEmployee(emp);
    attendance.setCheckIn(LocalTime.now());
    attendance.setDate(LocalDate.now());
    attendance.setStatus("PRESENT");
    return ResponseEntity.ok(attendanceRepository.save(attendance));
  }

  @PostMapping("/checkout/{id}")
  public ResponseEntity<Attendance> checkOut(@PathVariable Long id) {
    return attendanceRepository.findById(id).map(record -> {
      record.setCheckOut(LocalTime.now());
      java.time.Duration duration = java.time.Duration.between(record.getCheckIn(), record.getCheckOut());
      record.setWorkingHours(duration.toMinutes() / 60.0);
      return ResponseEntity.ok(attendanceRepository.save(record));
    }).orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/admin/mark")
  @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> markAttendanceByAdmin(@RequestBody java.util.Map<String, Object> payload) {
    try {
        Long empId = Long.valueOf(payload.get("employeeId").toString());
        LocalDate date = LocalDate.parse(payload.get("date").toString());
        String status = payload.get("status").toString();
        
        Employee emp = employeeRepository.findById(empId).orElse(null);
        if (emp == null) return ResponseEntity.badRequest().body("Employee not found");
        
        Attendance record = attendanceRepository.findByEmployeeIdAndDate(empId, date);
        if (record == null) {
            record = new Attendance();
            record.setEmployee(emp);
            record.setDate(date);
        }
        record.setStatus(status);
        
        if (payload.get("checkIn") != null && !payload.get("checkIn").toString().isEmpty()) {
            record.setCheckIn(LocalTime.parse(payload.get("checkIn").toString()));
        } else {
            record.setCheckIn(null);
        }
        
        if (payload.get("checkOut") != null && !payload.get("checkOut").toString().isEmpty()) {
            record.setCheckOut(LocalTime.parse(payload.get("checkOut").toString()));
            if (record.getCheckIn() != null) {
                java.time.Duration duration = java.time.Duration.between(record.getCheckIn(), record.getCheckOut());
                record.setWorkingHours(duration.toMinutes() / 60.0);
            }
        } else {
            record.setCheckOut(null);
            record.setWorkingHours(0.0);
        }
        
        return ResponseEntity.ok(attendanceRepository.save(record));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Invalid payload: " + e.getMessage());
    }
  }
}