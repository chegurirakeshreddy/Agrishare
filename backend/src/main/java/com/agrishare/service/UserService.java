
package com.agrishare.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.agrishare.backend.dto.RegisterRequest;
import com.agrishare.backend.entity.AppUser;
import com.agrishare.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public UserService(
            UserRepository repository,
            PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public AppUser register(RegisterRequest request) {

        String email = request.email().trim().toLowerCase();

        if (!request.role().equalsIgnoreCase("FARMER")
                && !request.role().equalsIgnoreCase("BUYER")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Role must be FARMER or BUYER"
            );
        }

        if (repository.existsByEmail(email)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Email is already registered"
            );
        }

        AppUser user = new AppUser();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(encoder.encode(request.password()));
        user.setRole(request.role().toUpperCase());

        return repository.save(user);
    }
}
