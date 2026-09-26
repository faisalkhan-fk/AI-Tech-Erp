package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Employee;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
  Employee findByUserId(Long userId);
  Optional<Employee> findByEmail(String email);
}