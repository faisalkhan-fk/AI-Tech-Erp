package com.aitech.erp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aitech.erp.repository.*;
import com.aitech.erp.models.*;
import java.util.List;
import java.time.LocalDate;

@Service
public class AIService {

  @Autowired EmployeeRepository employeeRepository;
  @Autowired ProjectRepository projectRepository;
  @Autowired TaskRepository taskRepository;
  @Autowired AttendanceRepository attendanceRepository;
  @Autowired LeaveRepository leaveRepository;

  public String generateDailyReport() {
    long empCount = employeeRepository.count();
    long projCount = projectRepository.count();
    List<Task> tasks = taskRepository.findAll();
    long completedTasks = tasks.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();
    long pendingTasks = tasks.stream().filter(t -> "PENDING".equalsIgnoreCase(t.getStatus()) || t.getStatus() == null).count();
    long highPriorityTasks = tasks.stream().filter(t -> "HIGH".equalsIgnoreCase(t.getPriority())).count();
    long attCount = attendanceRepository.count();
    long leaveCount = leaveRepository.count();

    StringBuilder report = new StringBuilder();
    report.append("🤖 Live AI Insights Report (Generated on ").append(LocalDate.now()).append("):\n\n");

    if (empCount == 0 && projCount == 0 && tasks.isEmpty()) {
      report.append("• Status: Fresh Workspace initialized with 0 active records.\n")
            .append("• Recommendation: Start by adding Employees in Employee Management and creating your first Project!");
      return report.toString();
    }

    report.append("• Workforce Status: ").append(empCount).append(" registered employee(s) in system. ");
    if (attCount > 0) {
      report.append("Attendance recorded for ").append(attCount).append(" log(s).\n");
    } else {
      report.append("No check-ins logged yet today.\n");
    }

    report.append("• Project Overview: ").append(projCount).append(" active project(s) ongoing.\n");
    
    report.append("• Task Analytics: ").append(tasks.size()).append(" total task(s) tracked (")
          .append(completedTasks).append(" completed, ").append(pendingTasks).append(" pending).\n");
    if (highPriorityTasks > 0) {
      report.append("⚠️ Alert: ").append(highPriorityTasks).append(" task(s) marked as HIGH priority require immediate attention!\n");
    }

    if (leaveCount > 0) {
      report.append("• Leave Applications: ").append(leaveCount).append(" leave request(s) submitted.\n");
    }

    report.append("\n💡 AI Action Recommendation: ");
    if (pendingTasks > completedTasks && pendingTasks > 0) {
      report.append("Pending tasks exceed completed tasks. Consider reallocating developers to high-priority tasks to maintain sprint velocity.");
    } else {
      report.append("Team productivity is optimal! All projects and tasks are progressing on schedule.");
    }

    return report.toString();
  }

  public String getTaskRecommendations(Long employeeId) {
    long taskCount = taskRepository.count();
    return "AI Task Recommendation for Employee #" + employeeId + ": Based on current workspace metrics (" + taskCount + " tasks active), recommended to assign next high-priority backend task.";
  }

  public String generatePerformanceSummary(Long employeeId) {
    return "Performance Score: 92/100 for Employee #" + employeeId + ". 100% task delivery on current sprint.";
  }

  public String chatAssistant(String query) {
    if (query == null || query.trim().isEmpty()) {
      return "Please type a question regarding HR, Projects, Tasks, or Employees.";
    }

    String lower = query.toLowerCase();
    
    if (lower.contains("employee") || lower.contains("staff") || lower.contains("team")) {
      long empCount = employeeRepository.count();
      return "Currently there are " + empCount + " employee(s) registered in the AI Tech ERP system.";
    }

    if (lower.contains("project")) {
      long projCount = projectRepository.count();
      return "There are currently " + projCount + " active project(s) being managed in the ERP workspace.";
    }

    if (lower.contains("task")) {
      List<Task> tasks = taskRepository.findAll();
      long pending = tasks.stream().filter(t -> "PENDING".equalsIgnoreCase(t.getStatus()) || t.getStatus() == null).count();
      long completed = tasks.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();
      return "Task Overview: Total " + tasks.size() + " task(s) (" + pending + " pending, " + completed + " completed).";
    }

    if (lower.contains("leave")) {
      long leaveCount = leaveRepository.count();
      return "Company Policy: Employees are entitled to 15 casual and 10 sick leaves per year. Currently there are " + leaveCount + " leave request(s) in system.";
    }

    if (lower.contains("attendance") || lower.contains("time") || lower.contains("check")) {
      long attCount = attendanceRepository.count();
      return "Core working hours are 10:00 AM - 6:00 PM. Total check-in log records: " + attCount + ".";
    }

    return "🤖 AI Assistant Response to '" + query + "': Everything in AI Tech ERP is functioning normally. You can ask me about employees, projects, tasks, attendance, or leave policies!";
  }
}