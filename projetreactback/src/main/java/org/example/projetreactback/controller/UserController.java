package org.example.projetreactback.controller;

import org.example.projetreactback.entity.Role;
import org.example.projetreactback.entity.User;
import org.example.projetreactback.repository.RoleRepository;
import org.example.projetreactback.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Endpoint d'inscription (qui attribue le role client par défaut)
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Par défaut, le rôle est 'client'
        Role clientRole = roleRepository.findByName("client")
                .orElseThrow(() -> new RuntimeException("Error: Role client non trouvé."));

        user.setRole(clientRole);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
}
