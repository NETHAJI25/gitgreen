package com.devlog.devlog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date; // The date of the entry

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "language")
    private String language;

    @Column(name = "time_spent_min")
    private Integer timeSpentMin;

    @Column(name = "backfilled")
    private boolean backfilled; // true if entered after the fact

    @Column(name = "mood")
    @Enumerated(EnumType.STRING)
    private Mood mood;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "entry", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EntrySection> sections;

    @ManyToMany
    @JoinTable(
        name = "entry_tags",
        joinColumns = @JoinColumn(name = "entry_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;

    // Transient fields for form handling
    @Transient
    private String task;
    @Transient
    private String input;
    @Transient
    private String output;
    @Transient
    private String sample;
    @Transient
    private String whatILearned;
    @Transient
    private String nextSteps;
}