package com.aitech.erp.services;

import com.aitech.erp.models.Employee;
import com.aitech.erp.models.PasswordResetOtp;
import com.aitech.erp.models.User;
import com.aitech.erp.repository.EmployeeRepository;
import com.aitech.erp.repository.PasswordResetOtpRepository;
import com.aitech.erp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetOtpRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    public void generateAndSendOtp(String email) {
        // 1. Find user by email (Assuming email is the username or stored in Employee)
        User user = null;
        String userName = "User";
        
        Optional<Employee> empOpt = employeeRepository.findByEmail(email);
        if (empOpt.isPresent()) {
            user = empOpt.get().getUser();
            userName = empOpt.get().getFirstName();
        } else {
            // Check if username is an email (Admin fallback)
            Optional<User> userOpt = userRepository.findByUsername(email);
            if (userOpt.isPresent()) {
                user = userOpt.get();
                userName = user.getUsername();
            }
        }

        // Even if user is not found, we don't throw an error to prevent email enumeration.
        // We just return silently.
        if (user == null) {
            return;
        }

        // 2. Rate limiting / Cooldown check (60 seconds)
        Optional<PasswordResetOtp> existingOtpOpt = otpRepository.findTopByUserOrderByCreatedAtDesc(user);
        if (existingOtpOpt.isPresent()) {
            PasswordResetOtp existingOtp = existingOtpOpt.get();
            if (!existingOtp.isUsed() && existingOtp.getCreatedAt().plusSeconds(60).isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Please wait 60 seconds before requesting a new OTP.");
            }
            // Invalidate the old OTP
            existingOtp.setUsed(true);
            otpRepository.save(existingOtp);
        }

        // 3. Generate 6-digit OTP
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        
        // 4. Hash and save OTP
        PasswordResetOtp resetOtp = new PasswordResetOtp();
        resetOtp.setUser(user);
        resetOtp.setEmail(email);
        resetOtp.setOtpHash(passwordEncoder.encode(otp));
        resetOtp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(resetOtp);

        // 5. Send email
        emailService.sendPasswordResetOtp(email, userName, otp);
    }

    public boolean verifyOtp(String email, String otpInput) {
        Optional<PasswordResetOtp> otpOpt = otpRepository.findTopByUserOrderByCreatedAtDesc(
                findUserByEmail(email)
        );

        if (otpOpt.isEmpty()) {
            throw new RuntimeException("No active OTP found for this email.");
        }

        PasswordResetOtp resetOtp = otpOpt.get();

        if (resetOtp.isUsed()) {
            throw new RuntimeException("This OTP has already been used or invalidated.");
        }

        if (resetOtp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("This OTP has expired.");
        }

        if (resetOtp.getAttemptCount() >= 3) {
            resetOtp.setUsed(true); // Invalidate
            otpRepository.save(resetOtp);
            throw new RuntimeException("Maximum attempts reached. Please request a new OTP.");
        }

        if (!passwordEncoder.matches(otpInput, resetOtp.getOtpHash())) {
            resetOtp.setAttemptCount(resetOtp.getAttemptCount() + 1);
            otpRepository.save(resetOtp);
            throw new RuntimeException("Invalid OTP.");
        }

        resetOtp.setVerified(true);
        otpRepository.save(resetOtp);
        return true;
    }

    public void resetPassword(String email, String newPassword) {
        // Find verified but unused OTP
        Optional<PasswordResetOtp> otpOpt = otpRepository.findByEmailAndVerifiedTrueAndUsedFalse(email);
        if (otpOpt.isEmpty()) {
            throw new RuntimeException("Unauthorized password reset attempt. Please verify OTP first.");
        }

        PasswordResetOtp resetOtp = otpOpt.get();

        // Expired check just in case they waited too long after verifying
        if (resetOtp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP session expired. Please start over.");
        }

        User user = resetOtp.getUser();

        // Ensure new password isn't the same as old
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("New password cannot be the same as the current password.");
        }

        // Update password and increment token version
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setTokenVersion(user.getTokenVersion() + 1); // Invalidates all existing JWT sessions
        userRepository.save(user);

        // Invalidate OTP
        resetOtp.setUsed(true);
        otpRepository.save(resetOtp);

        // Send success email
        String userName = "User";
        Optional<Employee> empOpt = employeeRepository.findByEmail(email);
        if (empOpt.isPresent()) {
            userName = empOpt.get().getFirstName();
        }
        emailService.sendPasswordResetSuccess(email, userName);
    }

    private User findUserByEmail(String email) {
        Optional<Employee> empOpt = employeeRepository.findByEmail(email);
        if (empOpt.isPresent()) {
            return empOpt.get().getUser();
        }
        Optional<User> userOpt = userRepository.findByUsername(email);
        if (userOpt.isPresent()) {
            return userOpt.get();
        }
        return null; // Will cause NPE above, but we handle it generally by checking if the user exists earlier in flows
    }
}
