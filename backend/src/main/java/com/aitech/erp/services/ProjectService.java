package com.aitech.erp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aitech.erp.models.*;
import com.aitech.erp.repository.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired ProjectRepository projectRepository;
    @Autowired EmployeeRepository employeeRepository;
    @Autowired TaskRepository taskRepository;

    public Project updateStatus(Long projectId, String status) {
        Optional<Project> opt = projectRepository.findById(projectId);
        if (opt.isPresent()) {
            Project project = opt.get();
            project.setStatus(status);
            return projectRepository.save(project);
        }
        throw new RuntimeException("Project not found");
    }

    public Project assignEmployee(Long projectId, Long employeeId) {
        Optional<Project> projOpt = projectRepository.findById(projectId);
        Optional<Employee> empOpt = employeeRepository.findById(employeeId);
        if (projOpt.isPresent() && empOpt.isPresent()) {
            Project project = projOpt.get();
            project.getTeamMembers().add(empOpt.get());
            return projectRepository.save(project);
        }
        throw new RuntimeException("Project or Employee not found");
    }

    public Project removeEmployee(Long projectId, Long employeeId) {
        Optional<Project> projOpt = projectRepository.findById(projectId);
        if (projOpt.isPresent()) {
            Project project = projOpt.get();
            project.getTeamMembers().removeIf(emp -> emp.getId().equals(employeeId));
            return projectRepository.save(project);
        }
        throw new RuntimeException("Project not found");
    }

    public Map<String, Object> getProjectReport(Long projectId) {
        Optional<Project> projOpt = projectRepository.findById(projectId);
        if (projOpt.isEmpty()) throw new RuntimeException("Project not found");
        
        Project project = projOpt.get();
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        
        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();
        long inProgressTasks = tasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count();
        long pendingTasks = tasks.stream().filter(t -> "TODO".equals(t.getStatus()) || "PENDING".equals(t.getStatus())).count();
        
        double progress = totalTasks == 0 ? 0 : ((double) completedTasks / totalTasks) * 100.0;
        
        Map<String, Object> report = new HashMap<>();
        report.put("project", project);
        report.put("totalTasks", totalTasks);
        report.put("completedTasks", completedTasks);
        report.put("inProgressTasks", inProgressTasks);
        report.put("pendingTasks", pendingTasks);
        report.put("progressPercentage", Math.round(progress));
        
        return report;
    }
}
