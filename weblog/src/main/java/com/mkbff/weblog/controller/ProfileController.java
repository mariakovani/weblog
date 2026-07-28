package com.mkbff.weblog.controller;

import com.mkbff.weblog.entities.Profile;
import com.mkbff.weblog.services.ProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/user/{userId}")
    public Profile getProfileByUserId(@PathVariable Integer userId) {
        return profileService.getProfileByUserId(userId);
    }

    @PostMapping
    public Profile createProfile(@RequestBody Profile profile) {
        return profileService.createProfile(profile);
    }

    @PutMapping("/{id}")
    public Profile updateProfile(@PathVariable Integer id, @RequestBody Profile profile) {
        return profileService.updateProfile(id, profile);
    }
}