package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.Department;
import com.aitech.erp.repository.DepartmentRepository;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
  @Autowired
  DepartmentRepository departmentRepository;

  @GetMapping
  public List<Department> getAll() {
    return departmentRepository.findAll();
  }

  @PostMapping
  public Department create(@RequestBody Department department) {
    return departmentRepository.save(department);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    departmentRepository.deleteById(id);
  }
}
