package com.mkbff.weblog.services;

import com.mkbff.weblog.entities.Profile;
import com.mkbff.weblog.repository.ProfileRepository;
import org.springframework.security.core.context.SecurityContextHolder;
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

        requireOwner(existing);

        existing.setBio(updatedProfile.getBio());
        existing.setAvatarUrl(updatedProfile.getAvatarUrl());
        existing.setLocation(updatedProfile.getLocation());
        existing.setWebsiteUrl(updatedProfile.getWebsiteUrl());

        return profileRepository.save(existing);
    }

    public void deleteProfile(Integer id) {
        Profile existing = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found with id: " + id));

        requireOwnerOrAdmin(existing);

        profileRepository.deleteById(id);
    }

    private void requireOwner(Profile profile) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isOwner = profile.getUser().getUsername().equals(currentUsername);

        if (!isOwner) {
            throw new RuntimeException("You can only update your own profile");
        }
    }

    private void requireOwnerOrAdmin(Profile profile) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean isOwner = profile.getUser().getUsername().equals(currentUsername);
        boolean isAdmin = hasRole("ROLE_ADMIN");

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You don't have permission to delete this profile");
        }
    }


    private boolean hasRole(String role) {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(role));
    }
}