package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mkbff.weblog.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
