package com.aitech.erp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aitech.erp.models.Notification;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
