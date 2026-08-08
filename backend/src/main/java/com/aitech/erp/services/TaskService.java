package com.aitech.erp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.aitech.erp.models.*;
import com.aitech.erp.repository.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService {
    @Autowired TaskRepository taskRepository;
    @Autowired EmployeeRepository employeeRepository;
    @Autowired CommentRepository commentRepository;
    @Autowired AttachmentRepository attachmentRepository;
    @Autowired NotificationService notificationService;

    private final String UPLOAD_DIR = "uploads/tasks/";

    public TaskService() {
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public Task assignTask(Long taskId, Long employeeId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        Optional<Employee> empOpt = employeeRepository.findById(employeeId);
        if (taskOpt.isPresent() && empOpt.isPresent()) {
            Task task = taskOpt.get();
            Employee employee = empOpt.get();
            task.setAssignedTo(employee);
            Task saved = taskRepository.save(task);
            if (employee.getUser() != null) {
                notificationService.createNotification(employee.getUser(), "You have been assigned a new task: " + task.getTitle(), "TASK");
            }
            return saved;
        }
        throw new RuntimeException("Task or Employee not found");
    }

    public Task updateStatus(Long taskId, String status) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setStatus(status);
            return taskRepository.save(task);
        }
        throw new RuntimeException("Task not found");
    }

    public Comment addComment(Long taskId, String content, Long authorId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        Optional<Employee> empOpt = employeeRepository.findById(authorId);
        if (taskOpt.isPresent() && empOpt.isPresent()) {
            Comment comment = new Comment();
            comment.setTask(taskOpt.get());
            comment.setAuthor(empOpt.get());
            comment.setContent(content);
            return commentRepository.save(comment);
        }
        throw new RuntimeException("Task or Author not found");
    }

    public List<Comment> getComments(Long taskId) {
        return commentRepository.findByTaskId(taskId);
    }

    public Attachment addAttachment(Long taskId, MultipartFile file) throws IOException {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            String originalFileName = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
            Path filePath = Paths.get(UPLOAD_DIR + uniqueFileName);
            
            Files.write(filePath, file.getBytes());

            Attachment attachment = new Attachment();
            attachment.setTask(taskOpt.get());
            attachment.setFileName(originalFileName);
            attachment.setFileType(file.getContentType());
            attachment.setFilePath(filePath.toString());
            attachment.setFileSize(file.getSize());
            
            return attachmentRepository.save(attachment);
        }
        throw new RuntimeException("Task not found");
    }

    public List<Attachment> getAttachments(Long taskId) {
        return attachmentRepository.findByTaskId(taskId);
    }
}
