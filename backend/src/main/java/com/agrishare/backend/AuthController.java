
package com.agrishare.backend;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import com.agrishare.backend.dto.LoginRequest;
import com.agrishare.backend.entity.AppUser;
import com.agrishare.backend.repository.UserRepository;
import com.agrishare.backend.service.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        String email = request.email().trim().toLowerCase();

        AppUser user = userRepository.findByEmail(email).orElse(null);

        if (user == null ||
                !passwordEncoder.matches(
                        request.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", "Invalid email or password"));
        }

        String token = jwtService.generateToken(
                user.getEmail(), user.getRole());

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "token", token,
                "tokenType", "Bearer",
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole(),
                "expiresIn", 3600
        ));
    }
    
@GetMapping("/me")
public ResponseEntity<?> me(
        org.springframework.security.core.Authentication authentication) {

    return ResponseEntity.ok(Map.of(
            "email", authentication.getName(),
            "role", authentication.getAuthorities()
                    .iterator().next().getAuthority()
    ));
}

}
