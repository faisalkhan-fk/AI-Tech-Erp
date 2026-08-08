package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Department;
public interface DepartmentRepository extends JpaRepository<Department, Long> {}