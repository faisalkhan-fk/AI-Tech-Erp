const fs = require('fs');
const path = require('path');

const basePath = "C:\\Users\\Faisal Khan\\.gemini\\antigravity-ide\\scratch\\ai-tech-erp\\backend\\src\\main\\java\\com\\aitech\\erp";

const files = {
  "payload/request/LoginRequest.java": `package com.aitech.erp.payload.request;
import jakarta.validation.constraints.NotBlank;
public class LoginRequest {
  @NotBlank
  private String username;
  @NotBlank
  private String password;
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
}`,
  "payload/request/SignupRequest.java": `package com.aitech.erp.payload.request;
import java.util.Set;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public class SignupRequest {
  @NotBlank
  @Size(min = 3, max = 20)
  private String username;
  private Set<String> role;
  @NotBlank
  @Size(min = 6, max = 40)
  private String password;
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public Set<String> getRole() { return this.role; }
  public void setRole(Set<String> role) { this.role = role; }
}`,
  "payload/response/JwtResponse.java": `package com.aitech.erp.payload.response;
import java.util.List;
public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private Long id;
  private String username;
  private List<String> roles;
  public JwtResponse(String accessToken, Long id, String username, List<String> roles) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.roles = roles;
  }
  public String getAccessToken() { return token; }
  public void setAccessToken(String accessToken) { this.token = accessToken; }
  public String getTokenType() { return type; }
  public void setTokenType(String tokenType) { this.type = tokenType; }
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public List<String> getRoles() { return roles; }
}`,
  "payload/response/MessageResponse.java": `package com.aitech.erp.payload.response;
public class MessageResponse {
  private String message;
  public MessageResponse(String message) { this.message = message; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
}`,
  "controllers/AuthController.java": `package com.aitech.erp.controllers;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());
        
    return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), roles));
  }

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
      strRoles.forEach(role -> {
        switch (role) {
        case "admin":
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
      });
    }
    user.setRoles(roles);
    userRepository.save(user);
    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
}`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log("Auth files generated successfully.");
