package com.aitech.erp.repository;

import com.aitech.erp.models.PasswordResetOtp;
import com.aitech.erp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    Optional<PasswordResetOtp> findTopByUserOrderByCreatedAtDesc(User user);
    Optional<PasswordResetOtp> findByEmailAndVerifiedTrueAndUsedFalse(String email);
}
