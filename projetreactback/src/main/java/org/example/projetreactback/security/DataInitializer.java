package org.example.projetreactback.security;

import org.example.projetreactback.entity.Role;
import org.example.projetreactback.entity.User;
import org.example.projetreactback.repository.RoleRepository;
import org.example.projetreactback.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            Role clientRole = roleRepository.findByName("client")
                    .orElseGet(() -> roleRepository.save(new Role(null, "client", null)));

            Role adminRole = roleRepository.findByName("admin")
                    .orElseGet(() -> roleRepository.save(new Role(null, "admin", null)));

            Role superAdminRole = roleRepository.findByName("super admin")
                    .orElseGet(() -> roleRepository.save(new Role(null, "super admin", null)));

            if (userRepository.findByUsername("superadmin").isEmpty()) {
                User sAdmin = new User();
                sAdmin.setUsername("superadmin");
                sAdmin.setPassword(passwordEncoder.encode("admin")); // pwd
                sAdmin.setRole(superAdminRole);
                userRepository.save(sAdmin);
            }
        };
    }
}
