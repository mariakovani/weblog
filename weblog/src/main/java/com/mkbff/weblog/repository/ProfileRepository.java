package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mkbff.weblog.entities.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    
}
