package com.aitech.erp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
  public List<Employee> getAllEmployees() {
    return employeeRepository.findAll();
  }

  @PostMapping
  public Employee createEmployee(@RequestBody Employee employee) {
    return employeeRepository.save(employee);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
    return employeeRepository.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
    return employeeRepository.findById(id).map(emp -> {
      emp.setFirstName(employeeDetails.getFirstName());
      emp.setLastName(employeeDetails.getLastName());
      emp.setEmail(employeeDetails.getEmail());
      emp.setDesignation(employeeDetails.getDesignation());
      emp.setPhone(employeeDetails.getPhone());
      if (employeeDetails.getProfilePic() != null) {
        emp.setProfilePic(employeeDetails.getProfilePic());
      }
      return ResponseEntity.ok(employeeRepository.save(emp));
    }).orElse(ResponseEntity.notFound().build());
  }

  @Autowired
  com.aitech.erp.repository.UserRepository userRepository;

  @PutMapping("/{id}/approve")
  @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> approveEmployee(@PathVariable Long id) {
      return employeeRepository.findById(id).map(emp -> {
          if (emp.getUser() != null) {
              com.aitech.erp.models.User user = emp.getUser();
              user.setApproved(true);
              userRepository.save(user);
              return ResponseEntity.ok(new com.aitech.erp.payload.response.MessageResponse("Employee approved successfully!"));
          }
          return ResponseEntity.badRequest().body(new com.aitech.erp.payload.response.MessageResponse("Employee has no associated user account."));
      }).orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
    employeeRepository.deleteById(id);
    return ResponseEntity.ok().build();
  }
}