package com.devlog.devlog.controller;

import com.devlog.devlog.entity.User;
import com.devlog.devlog.repository.UserRepository;
import com.devlog.devlog.service.GitHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final GitHubService gitHubService;

    @GetMapping("/github/login")
    public ResponseEntity<String> githubLogin() {
        return ResponseEntity.ok("Redirect to /oauth2/authorization/github to start GitHub OAuth");
    }

    @GetMapping("/github/callback")
    public ResponseEntity<Map<String, Object>> githubCallback(
            @RequestParam String code,
            @AuthenticationPrincipal OAuth2User principal) {

        Map<String, Object> response = new HashMap<>();
        response.put("message", "GitHub callback processed");
        response.put("code", code);
        response.put("principal", principal != null ? principal.getAttributes() : null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(
            @AuthenticationPrincipal OAuth2User principal) {

        if (principal == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        String email = principal.getAttribute("email");
        if (email == null) {
            Map<String, Object> attrs = new HashMap<>(principal.getAttributes());
            attrs.put("authenticated", true);
            return ResponseEntity.ok(attrs);
        }

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.ok(Map.of("authenticated", true, "email", email));
        }
        User u = user.get();
        Map<String, Object> dto = new HashMap<>();
        dto.put("authenticated", true);
        dto.put("id", u.getId());
        dto.put("username", u.getUsername());
        dto.put("email", u.getEmail());
        dto.put("avatarUrl", u.getAvatarUrl());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/repo/setup")
    public ResponseEntity<Map<String, String>> setupRepository(
            @RequestParam String repoOwner,
            @RequestParam String repoName,
            @RequestParam(defaultValue = "false") boolean isPrivate,
            @AuthenticationPrincipal OAuth2User principal) {

        Map<String, String> response = Map.of(
                "message", "Repository setup would be processed here",
                "owner", repoOwner,
                "repo", repoName,
                "private", Boolean.toString(isPrivate)
        );

        return ResponseEntity.ok(response);
    }
}
