package com.aitech.erp.security.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.aitech.erp.models.User;
import com.aitech.erp.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  UserRepository userRepository;

  @Autowired
  com.aitech.erp.repository.EmployeeRepository employeeRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = null;
    
    // Check if the input looks like an email
    if (username != null && username.contains("@")) {
      java.util.Optional<com.aitech.erp.models.Employee> empOpt = employeeRepository.findByEmail(username);
      if (empOpt.isPresent() && empOpt.get().getUser() != null) {
        user = empOpt.get().getUser();
      }
    }
    
    // Fallback to username lookup if not found by email or not an email
    if (user == null) {
      user = userRepository.findByUsername(username)
          .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username or email: " + username));
    }
    
    return UserDetailsImpl.build(user);
  }
}