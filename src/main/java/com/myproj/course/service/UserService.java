package com.myproj.course.service;

import com.myproj.course.model.Property;
import com.myproj.course.model.Review;
import com.myproj.course.model.Role;
import com.myproj.course.model.Users;
import com.myproj.course.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Users registerUser(Users user) {
        return userRepository.save(user);
    }

    public Users getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("user not found"));
    }

    public Users updateUser(Long id, Users user) {
        Users oldUser = getUserById(id);
        oldUser.setPassword(user.getPassword());
        oldUser.setSessionToken(user.getSessionToken());
        oldUser.setUsername(user.getUsername());
        oldUser.setEmail(user.getEmail());
        //oldUser.setRole(user.getRole());
        //oldUser.setProperties(user.getProperties());
        oldUser.setFullName(user.getFullName());
        return userRepository.save(oldUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<Property> getUserProperties(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getProperties();
    }

    public Users setUserRole(Long id, Role role) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public Users login(String username, String password) {
        Users user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        throw new RuntimeException("Invalid credentials");
    }

}
