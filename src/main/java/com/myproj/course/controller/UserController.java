package com.myproj.course.controller;

import com.myproj.course.model.Property;
import com.myproj.course.model.Role;
import com.myproj.course.model.Users;
import com.myproj.course.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    public UserController() {

    }

    @GetMapping
    public List<Users> getAllUsers() {
        logger.info("Getting all users.");
        return userService.getAllUsers();
    }

    @PostMapping
    public Users registerUser(@RequestBody Users user) {
        logger.info("Registering new user: {}", user);
        return userService.registerUser(user);
    }

    @GetMapping("/{id}")
    public Users getUserById(@PathVariable Long id) {
        logger.info("Getting user with ID: {}", id);
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public Users updateUser(@PathVariable Long id, @RequestBody Users user) {
        logger.info("Updating user with ID: {}", id);
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        logger.info("Deleting user with ID: {}", id);
        userService.deleteUser(id);
    }

    @PostMapping("/{id}/role")
    public Users setUserRole(@PathVariable Long id, @RequestBody Role role) {
        logger.info("Assigning role {} to user with ID: {}", role, id);
        return userService.setUserRole(id, role);
    }

    @GetMapping("/{id}/properties")
    public List<Property> getUserProperties(@PathVariable Long id) {
        logger.info("Getting properties for user with ID: {}", id);
        return userService.getUserProperties(id);
    }

    @PostMapping("/login")
    public Users loginUser(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        logger.info("User login attempt with username: {}", username);
        return userService.login(username, password);
    }

}
