package com.mkbff.weblog.services;

import com.mkbff.weblog.entities.User;
import com.mkbff.weblog.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> searchUsers(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username);
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    public User getUserById(@NonNull Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}