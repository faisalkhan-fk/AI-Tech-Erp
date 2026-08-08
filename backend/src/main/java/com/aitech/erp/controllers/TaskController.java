package com.aitech.erp.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.Task;
import com.aitech.erp.models.Comment;
import com.aitech.erp.models.Attachment;
import com.aitech.erp.repository.TaskRepository;
import com.aitech.erp.services.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
  @Autowired TaskRepository taskRepository;
  @Autowired TaskService taskService;
  
  @GetMapping
  public List<Task> getAll() { return taskRepository.findAll(); }
  
  @GetMapping("/employee/{id}")
  public List<Task> getByEmployee(@PathVariable Long id) { return taskRepository.findByAssignedToId(id); }
  
  @PostMapping
  public Task create(@RequestBody Task task) { return taskRepository.save(task); }

  @PostMapping("/{id}/assign")
  public ResponseEntity<?> assignTask(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
      taskService.assignTask(id, payload.get("employeeId"));
      return ResponseEntity.ok().build();
  }

  @PutMapping("/{id}/status")
  public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
      taskService.updateStatus(id, payload.get("status"));
      return ResponseEntity.ok().build();
  }

  @PostMapping("/{id}/comments")
  public ResponseEntity<Comment> addComment(@PathVariable Long id, @RequestBody Map<String, String> payload) {
      Long authorId = Long.parseLong(payload.get("authorId"));
      Comment c = taskService.addComment(id, payload.get("content"), authorId);
      return ResponseEntity.ok(c);
  }

  @GetMapping("/{id}/comments")
  public List<Comment> getComments(@PathVariable Long id) {
      return taskService.getComments(id);
  }

  @PostMapping("/{id}/attachments")
  public ResponseEntity<Attachment> uploadAttachment(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
      try {
          Attachment att = taskService.addAttachment(id, file);
          return ResponseEntity.ok(att);
      } catch (Exception e) {
          return ResponseEntity.badRequest().build();
      }
  }

  @GetMapping("/{id}/attachments")
  public List<Attachment> getAttachments(@PathVariable Long id) {
      return taskService.getAttachments(id);
  }
}