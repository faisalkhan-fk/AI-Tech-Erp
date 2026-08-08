package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.LeaveRequest;
import com.aitech.erp.repository.LeaveRepository;
import com.aitech.erp.models.Employee;
import com.aitech.erp.repository.EmployeeRepository;
import java.util.List;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leaves")
public class LeaveController {
  @Autowired LeaveRepository leaveRepository;
  @Autowired com.aitech.erp.services.NotificationService notificationService;
  @Autowired EmployeeRepository employeeRepository;

  private Employee getCurrentEmployee() {
    org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
    if (auth != null && auth.getPrincipal() instanceof com.aitech.erp.security.services.UserDetailsImpl) {
      Long userId = ((com.aitech.erp.security.services.UserDetailsImpl) auth.getPrincipal()).getId();
      return employeeRepository.findByUserId(userId);
    }
    return null;
  }

  private boolean isAdmin() {
    org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
    if (auth != null) {
      return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
    return false;
  }
  
  @GetMapping
  public ResponseEntity<List<LeaveRequest>> getAll() {
    if (isAdmin()) {
      return ResponseEntity.ok(leaveRepository.findAll());
    } else {
      Employee emp = getCurrentEmployee();
      if (emp != null) {
        return ResponseEntity.ok(leaveRepository.findByEmployeeId(emp.getId()));
      }
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/employee/{id}")
  public List<LeaveRequest> getByEmployee(@PathVariable Long id) { return leaveRepository.findByEmployeeId(id); }

  @PostMapping
  public ResponseEntity<LeaveRequest> apply(@RequestBody LeaveRequest leave) {
    Employee emp = getCurrentEmployee();
    if (emp == null) return ResponseEntity.badRequest().build();

    leave.setEmployee(emp);
    leave.setStatus("PENDING");
    return ResponseEntity.ok(leaveRepository.save(leave));
  }
  
  @PutMapping("/{id}/approve")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<LeaveRequest> approve(@PathVariable Long id) {
    return leaveRepository.findById(id).map(l -> {
      l.setStatus("APPROVED");
      LeaveRequest saved = leaveRepository.save(l);
      if (saved.getEmployee() != null && saved.getEmployee().getUser() != null) {
          notificationService.createNotification(saved.getEmployee().getUser(), "Your leave request for " + saved.getStartDate() + " has been APPROVED.", "LEAVE");
      }
      return ResponseEntity.ok(saved);
    }).orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}/reject")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<LeaveRequest> reject(@PathVariable Long id) {
    return leaveRepository.findById(id).map(l -> {
      l.setStatus("REJECTED");
      return ResponseEntity.ok(leaveRepository.save(l));
    }).orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/balance/{employeeId}")
  public ResponseEntity<Integer> getBalance(@PathVariable Long employeeId) {
    List<LeaveRequest> approved = leaveRepository.findByEmployeeId(employeeId).stream()
        .filter(l -> "APPROVED".equals(l.getStatus()))
        .toList();
    int usedDays = approved.stream()
        .mapToInt(l -> (int)ChronoUnit.DAYS.between(l.getStartDate(), l.getEndDate()) + 1)
        .sum();
    int totalAllowed = 30;
    int remaining = totalAllowed - usedDays;
    return ResponseEntity.ok(Math.max(remaining, 0));
  }
}