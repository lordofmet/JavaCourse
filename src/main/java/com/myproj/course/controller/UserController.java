package com.myproj.course.controller;

import com.myproj.course.model.Property;
import com.myproj.course.model.Role;
import com.myproj.course.model.Users;
import com.myproj.course.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

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
        return userService.getAllUsers();
    }

    @PostMapping
    public Users registerUser(@RequestBody Users user) {
        return userService.registerUser(user);
    }

    @GetMapping("/{id}")
    public Users getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public Users updateUser(@PathVariable Long id, @RequestBody Users user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PostMapping("/{id}/role")
    public Users setUserRole(@PathVariable Long id, @RequestBody Role role) {
        return userService.setUserRole(id, role);
    }

    @GetMapping("/{id}/properties")
    public List<Property> getUserProperties(@PathVariable Long id) {
        return userService.getUserProperties(id);
    }

    @PostMapping("/login")
    public Users loginUser(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        return userService.login(username, password);
    }

}
