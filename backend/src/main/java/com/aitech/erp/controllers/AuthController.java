package com.aitech.erp.controllers;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.aitech.erp.models.ERole;
import com.aitech.erp.models.Role;
import com.aitech.erp.models.User;
import com.aitech.erp.payload.request.LoginRequest;
import com.aitech.erp.payload.request.SignupRequest;
import com.aitech.erp.payload.response.JwtResponse;
import com.aitech.erp.payload.response.MessageResponse;
import com.aitech.erp.repository.RoleRepository;
import com.aitech.erp.repository.UserRepository;
import com.aitech.erp.security.jwt.JwtUtils;
import com.aitech.erp.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;
  @Autowired
  UserRepository userRepository;
  @Autowired
  RoleRepository roleRepository;
  @Autowired
  PasswordEncoder encoder;
  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
    if (user != null && !user.isApproved()) {
        return ResponseEntity.status(403).body(new MessageResponse("Error: Your account is pending Admin approval."));
    }

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());
        
    return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), roles));
  }

  @Autowired
  com.aitech.erp.repository.EmployeeRepository employeeRepository;

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
    }
    User user = new User(signUpRequest.getUsername(), encoder.encode(signUpRequest.getPassword()));
    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();
    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_EMPLOYEE)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      for (String role : strRoles) {
        switch (role) {
        case "admin":
          // Allow admin role only if no admin exists yet
          boolean adminExists = userRepository.findAll().stream()
              .anyMatch(u -> u.getRoles().stream()
                  .anyMatch(r -> r.getName() == ERole.ROLE_ADMIN));
          if (adminExists) {
              return ResponseEntity.badRequest().body(new MessageResponse("Error: Only one admin allowed in the system."));
          }
          Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(adminRole);
          break;
        case "manager":
          Role modRole = roleRepository.findByName(ERole.ROLE_MANAGER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(modRole);
          break;
        default:
          Role userRole = roleRepository.findByName(ERole.ROLE_EMPLOYEE)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(userRole);
        }
      }
    }
    user.setRoles(roles);
    user.setApproved(false); // explicit, though it defaults to false
    User savedUser = userRepository.save(user);

    // Auto-create Employee profile
    com.aitech.erp.models.Employee emp = new com.aitech.erp.models.Employee();
    emp.setUser(savedUser);
    emp.setFirstName(signUpRequest.getFirstName());
    emp.setLastName(signUpRequest.getLastName());
    emp.setEmail(signUpRequest.getEmail());
    emp.setPhone(signUpRequest.getPhone());
    emp.setDesignation(signUpRequest.getDesignation());
    
    if (signUpRequest.getDepartmentId() != null) {
      com.aitech.erp.models.Department dept = new com.aitech.erp.models.Department();
      dept.setId(signUpRequest.getDepartmentId());
      emp.setDepartment(dept);
    }
    
    employeeRepository.save(emp);

    return ResponseEntity.ok(new MessageResponse("User registered successfully! Pending Admin approval."));
  }

  @Autowired
  com.aitech.erp.services.PasswordResetService passwordResetService;

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@Valid @RequestBody com.aitech.erp.payload.request.ForgotPasswordRequest request) {
    try {
      passwordResetService.generateAndSendOtp(request.getEmail());
    } catch (org.springframework.mail.MailException e) {
      System.err.println("Mail Error: " + e.getMessage());
      return ResponseEntity.internalServerError().body(new MessageResponse("SMTP Error: " + e.getMessage()));
    } catch (Exception e) {
      if (e.getMessage() != null && e.getMessage().contains("Please wait")) {
        return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
      }
      System.err.println("Forgot Password Error: " + e.getMessage());
    }
    return ResponseEntity.ok(new MessageResponse("If an account exists with this email, an OTP has been sent."));
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<?> verifyOtp(@Valid @RequestBody com.aitech.erp.payload.request.VerifyOtpRequest request) {
    try {
      passwordResetService.verifyOtp(request.getEmail(), request.getOtp());
      return ResponseEntity.ok(new MessageResponse("OTP verified successfully. You can now reset your password."));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
    }
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@Valid @RequestBody com.aitech.erp.payload.request.ResetPasswordRequest request) {
    if (!request.getNewPassword().equals(request.getConfirmPassword())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Passwords do not match."));
    }
    
    try {
      passwordResetService.resetPassword(request.getEmail(), request.getNewPassword());
      return ResponseEntity.ok(new MessageResponse("Password reset successfully! You can now log in."));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
    }
  }

  @PostMapping("/change-password")
  public ResponseEntity<?> changePassword(
      @Valid @RequestBody com.aitech.erp.payload.request.ChangePasswordRequest request,
      Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      return ResponseEntity.status(401).body(new MessageResponse("Error: Unauthorized"));
    }
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    User user = userRepository.findByUsername(userDetails.getUsername())
        .orElseThrow(() -> new RuntimeException("Error: User not found."));

    // Verify old password
    if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Incorrect old password."));
    }

    // Update with new password
    user.setPassword(encoder.encode(request.getNewPassword()));
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
  }
}