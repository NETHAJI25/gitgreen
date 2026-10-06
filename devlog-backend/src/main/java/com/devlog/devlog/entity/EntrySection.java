package com.devlog.devlog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "entry_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntrySection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "entry_id", nullable = false)
    private Entry entry;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SectionType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "order_index")
    private Integer orderIndex;
}