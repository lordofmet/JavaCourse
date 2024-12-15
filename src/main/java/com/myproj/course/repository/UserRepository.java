package com.myproj.course.repository;

import com.myproj.course.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByUsername(String username);
    Users findByEmail(String email);
}
