package com.devlog.devlog.controller;

import com.devlog.devlog.dto.EntryDTO;
import com.devlog.devlog.entity.Entry;
import com.devlog.devlog.entity.User;
import com.devlog.devlog.mapper.EntryMapper;
import com.devlog.devlog.repository.UserRepository;
import com.devlog.devlog.service.EntryService;
import com.devlog.devlog.service.GitHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/entries")
@RequiredArgsConstructor
public class EntryController {

    private final EntryService entryService;
    private final GitHubService gitHubService;
    private final EntryMapper entryMapper;
    private final UserRepository userRepository;

    private User resolveUser(OAuth2User principal) {
        String email = principal != null ? principal.getAttribute("email") : null;
        if (email == null) email = "test@example.com";
        String username = principal != null ? principal.getAttribute("login") : null;
        if (username == null) username = "testuser";

        final String finalEmail = email;
        final String finalUsername = username;
        return userRepository.findByEmail(finalEmail).orElseGet(() -> {
            User u = User.builder()
                    .username(finalUsername)
                    .email(finalEmail)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            return userRepository.save(u);
        });
    }

    @PostMapping
    public ResponseEntity<EntryDTO> createEntry(
            @RequestBody EntryDTO entryDTO,
            @AuthenticationPrincipal OAuth2User principal) {

        User user = resolveUser(principal);

        Entry entry = entryMapper.toEntity(entryDTO);
        Entry savedEntry = entryService.saveEntry(user, entry);

        try {
            gitHubService.saveEntryToRepo(user, savedEntry);
        } catch (Exception e) {
            // Log but still return success; repo may not be configured in dev
            e.printStackTrace();
        }

        return ResponseEntity.ok(entryMapper.toDTO(savedEntry));
    }

    @GetMapping
    public ResponseEntity<List<EntryDTO>> getEntries(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        User user = resolveUser(principal);

        List<Entry> entries;
        if (startDate != null && endDate != null) {
            entries = entryService.getEntriesByUserAndDateRange(user, startDate, endDate);
        } else {
            entries = entryService.getEntriesByUser(user);
        }

        List<EntryDTO> dtos = entries.stream()
                .map(entryMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntryDTO> getEntryById(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal) {

        Entry entry = entryService.getEntryById(id);
        if (entry == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entryMapper.toDTO(entry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal) {

        entryService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }
}
