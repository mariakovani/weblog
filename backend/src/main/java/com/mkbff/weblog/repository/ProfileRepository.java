package com.mkbff.weblog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mkbff.weblog.entities.Profile;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Integer> {
    Optional<Profile> findByUserId(Integer userId);
}
