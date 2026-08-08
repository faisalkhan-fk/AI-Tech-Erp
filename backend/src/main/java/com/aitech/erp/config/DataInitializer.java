package com.aitech.erp.config;

import com.aitech.erp.models.ERole;
import com.aitech.erp.models.Role;
import com.aitech.erp.models.User;
import com.aitech.erp.repository.RoleRepository;
import com.aitech.erp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.aitech.erp.repository.EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles if not present
        Role empRole = roleRepository.findByName(ERole.ROLE_EMPLOYEE).orElseGet(() -> {
            Role r = new Role();
            r.setName(ERole.ROLE_EMPLOYEE);
            return roleRepository.save(r);
        });

        Role mgrRole = roleRepository.findByName(ERole.ROLE_MANAGER).orElseGet(() -> {
            Role r = new Role();
            r.setName(ERole.ROLE_MANAGER);
            return roleRepository.save(r);
        });

        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElseGet(() -> {
            Role r = new Role();
            r.setName(ERole.ROLE_ADMIN);
            return roleRepository.save(r);
        });

        // Initialize Admin User if not present
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", passwordEncoder.encode("admin123"));
            admin.setApproved(true);
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);
            User savedAdmin = userRepository.save(admin);
            System.out.println("Default Admin created: admin / admin123");
            
            com.aitech.erp.models.Employee adminEmp = new com.aitech.erp.models.Employee();
            adminEmp.setUser(savedAdmin);
            adminEmp.setFirstName("Super");
            adminEmp.setLastName("Admin");
            adminEmp.setEmail("admin@aitech.com");
            employeeRepository.save(adminEmp);
        }

        // Initialize Employee User if not present
        if (!userRepository.existsByUsername("employee")) {
            User emp = new User("employee", passwordEncoder.encode("emp123"));
            emp.setApproved(true);
            Set<Role> roles = new HashSet<>();
            roles.add(empRole);
            emp.setRoles(roles);
            User savedEmp = userRepository.save(emp);
            System.out.println("Default Employee created: employee / emp123");
            
            com.aitech.erp.models.Employee defaultEmp = new com.aitech.erp.models.Employee();
            defaultEmp.setUser(savedEmp);
            defaultEmp.setFirstName("Default");
            defaultEmp.setLastName("Employee");
            defaultEmp.setEmail("employee@aitech.com");
            employeeRepository.save(defaultEmp);
        }
    }
}
