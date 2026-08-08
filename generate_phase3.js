const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Faisal Khan\\.gemini\\antigravity-ide\\scratch\\ai-tech-erp\\backend\\src\\main\\java\\com\\aitech\\erp";

const files = {
  "models/Project.java": `package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
@Entity
@Table(name = "projects")
@Data
public class Project {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private String description;
  private LocalDate startDate;
  private LocalDate endDate;
  private String status; // PENDING, IN_PROGRESS, COMPLETED
}`,

  "models/Task.java": `package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
@Entity
@Table(name = "tasks")
@Data
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "project_id")
  private Project project;
  private String title;
  private String description;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "assigned_to")
  private Employee assignedTo;
  private String status;
  private String priority;
  private LocalDate dueDate;
}`,

  "models/LeaveRequest.java": `package com.aitech.erp.models;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
@Entity
@Table(name = "leaves")
@Data
public class LeaveRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "employee_id")
  private Employee employee;
  private LocalDate startDate;
  private LocalDate endDate;
  private String type; // SICK, CASUAL, ANNUAL
  private String status; // PENDING, APPROVED, REJECTED
  private String reason;
}`,

  "repository/ProjectRepository.java": `package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Project;
public interface ProjectRepository extends JpaRepository<Project, Long> {}`,

  "repository/TaskRepository.java": `package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Task;
import java.util.List;
public interface TaskRepository extends JpaRepository<Task, Long> {
  List<Task> findByAssignedToId(Long employeeId);
}`,

  "repository/LeaveRepository.java": `package com.aitech.erp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.LeaveRequest;
import java.util.List;
public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
  List<LeaveRequest> findByEmployeeId(Long employeeId);
}`,

  "controllers/ProjectController.java": `package com.aitech.erp.controllers;
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
  @GetMapping
  public List<Project> getAll() { return projectRepository.findAll(); }
  @PostMapping
  public Project create(@RequestBody Project project) { return projectRepository.save(project); }
}`,

  "controllers/TaskController.java": `package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.Task;
import com.aitech.erp.repository.TaskRepository;
import java.util.List;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
  @Autowired TaskRepository taskRepository;
  @GetMapping
  public List<Task> getAll() { return taskRepository.findAll(); }
  @GetMapping("/employee/{id}")
  public List<Task> getByEmployee(@PathVariable Long id) { return taskRepository.findByAssignedToId(id); }
  @PostMapping
  public Task create(@RequestBody Task task) { return taskRepository.save(task); }
}`,

  "controllers/LeaveController.java": `package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.LeaveRequest;
import com.aitech.erp.repository.LeaveRepository;
import java.util.List;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leaves")
public class LeaveController {
  @Autowired LeaveRepository leaveRepository;
  @GetMapping
  public List<LeaveRequest> getAll() { return leaveRepository.findAll(); }
  @GetMapping("/employee/{id}")
  public List<LeaveRequest> getByEmployee(@PathVariable Long id) { return leaveRepository.findByEmployeeId(id); }
  @PostMapping
  public LeaveRequest apply(@RequestBody LeaveRequest leave) {
    leave.setStatus("PENDING");
    return leaveRepository.save(leave); 
  }
}`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log("Phase 3 backend files generated successfully.");
