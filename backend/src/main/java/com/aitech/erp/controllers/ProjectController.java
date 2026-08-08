package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.Project;
import com.aitech.erp.repository.ProjectRepository;
import java.util.List;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
  @Autowired ProjectRepository projectRepository;
  @Autowired com.aitech.erp.services.ProjectService projectService;
  
  @GetMapping
  public List<Project> getAll() { return projectRepository.findAll(); }
  
  @PostMapping
  public Project create(@RequestBody Project project) { return projectRepository.save(project); }

  @PutMapping("/{id}/status")
  public org.springframework.http.ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
      projectService.updateStatus(id, payload.get("status"));
      return org.springframework.http.ResponseEntity.ok().build();
  }

  @PostMapping("/{id}/members")
  public org.springframework.http.ResponseEntity<?> assignEmployee(@PathVariable Long id, @RequestBody java.util.Map<String, Long> payload) {
      projectService.assignEmployee(id, payload.get("employeeId"));
      return org.springframework.http.ResponseEntity.ok().build();
  }

  @DeleteMapping("/{id}/members/{employeeId}")
  public org.springframework.http.ResponseEntity<?> removeEmployee(@PathVariable Long id, @PathVariable Long employeeId) {
      projectService.removeEmployee(id, employeeId);
      return org.springframework.http.ResponseEntity.ok().build();
  }

  @GetMapping("/{id}/report")
  public org.springframework.http.ResponseEntity<?> getReport(@PathVariable Long id) {
      return org.springframework.http.ResponseEntity.ok(projectService.getProjectReport(id));
  }
}