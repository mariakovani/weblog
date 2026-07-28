package com.mkbff.weblog.services;

import com.mkbff.weblog.entities.Profile;
import com.mkbff.weblog.repository.ProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile getProfileByUserId(Integer userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user id: " + userId));
    }

    public Profile createProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    public Profile updateProfile(Integer id, Profile updatedProfile) {
        Profile existing = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found with id: " + id));

        existing.setBio(updatedProfile.getBio());
        existing.setAvatarUrl(updatedProfile.getAvatarUrl());
        existing.setLocation(updatedProfile.getLocation());
        existing.setWebsiteUrl(updatedProfile.getWebsiteUrl());

        return profileRepository.save(existing);
    }
}