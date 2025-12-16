package com.alpha.SocialRoom.services;

import com.alpha.SocialRoom.entity.User;
import com.alpha.SocialRoom.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final String UPLOAD_DIR = "uploads/";

    public UserService(UserRepository userRepository) throws IOException {
        this.userRepository = userRepository;
        Files.createDirectories(Paths.get(UPLOAD_DIR));
    }

    public User register(String username, String password) throws IOException {
        username = username.trim().toLowerCase();
        password = password.trim();

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already taken");
        }

        // ✅ Create user and set fields directly (no lambda)
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);

        userRepository.save(user);

        // ✅ Create folder
        Path userDir = Paths.get(UPLOAD_DIR, username);
        Files.createDirectories(userDir);

        return user;
    }

  public boolean login(String username, String password) {
    username = username.trim().toLowerCase();
    password = password.trim();

    Optional<User> optionalUser = userRepository.findByUsername(username);
    if (optionalUser.isEmpty()) return false;

    User user = optionalUser.get();
    return user.getPassword().equals(password); // exact match
}
}