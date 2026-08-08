package com.aitech.erp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.Notification;
import com.aitech.erp.models.User;
import com.aitech.erp.repository.UserRepository;
import com.aitech.erp.security.services.UserDetailsImpl;
import com.aitech.erp.services.NotificationService;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired NotificationService notificationService;
    @Autowired UserRepository userRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl) {
            return ((UserDetailsImpl) auth.getPrincipal()).getId();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reminders")
    public ResponseEntity<?> triggerReminders() {
        Long userId = getCurrentUserId();
        if (userId != null) {
            notificationService.generateReminders(userId);
        }
        return ResponseEntity.ok().build();
    }
}
