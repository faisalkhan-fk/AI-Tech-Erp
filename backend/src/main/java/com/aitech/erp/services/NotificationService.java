package com.aitech.erp.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aitech.erp.models.*;
import com.aitech.erp.repository.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {
    @Autowired NotificationRepository notificationRepository;
    @Autowired ProjectRepository projectRepository;
    @Autowired EmployeeRepository employeeRepository;
    @Autowired AttendanceRepository attendanceRepository;
    @Autowired UserRepository userRepository;

    public void createNotification(User user, String message, String type) {
        if (user == null) return;
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setMessage(message);
        notif.setType(type);
        notificationRepository.save(notif);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void generateReminders(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;
        
        Employee employee = employeeRepository.findByUserId(userId);
        if (employee != null) {
            // Check Attendance Reminder
            Attendance todayAtt = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), LocalDate.now());
            if (todayAtt == null) {
                boolean alreadySent = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                    .anyMatch(n -> "ATTENDANCE".equals(n.getType()) && n.getMessage().contains("checked in") && n.getCreatedAt().toLocalDate().equals(LocalDate.now()));
                if (!alreadySent) {
                    createNotification(user, "Reminder: You have not checked in for today.", "ATTENDANCE");
                }
            }
            
            // Check Project Deadlines
            List<Project> activeProjects = projectRepository.findAll().stream()
                .filter(p -> !"COMPLETED".equals(p.getStatus()))
                .toList();
                
            for (Project p : activeProjects) {
                if (p.getTeamMembers().contains(employee) && p.getEndDate() != null) {
                    long daysBetween = ChronoUnit.DAYS.between(LocalDate.now(), p.getEndDate());
                    if (daysBetween >= 0 && daysBetween <= 3) {
                        boolean alreadySent = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                            .anyMatch(n -> "PROJECT".equals(n.getType()) && n.getMessage().contains(p.getName()) && n.getCreatedAt().toLocalDate().equals(LocalDate.now()));
                        if (!alreadySent) {
                            createNotification(user, "Reminder: Project '" + p.getName() + "' is due in " + daysBetween + " days.", "PROJECT");
                        }
                    }
                }
            }
        }
    }
}
