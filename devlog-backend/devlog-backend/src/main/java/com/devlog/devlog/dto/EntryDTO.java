package com.devlog.devlog.dto;

import com.devlog.devlog.entity.EntrySection;
import com.devlog.devlog.entity.Tag;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntryDTO {
    private Long id;
    private LocalDate date;
    private String projectName;
    private String language;
    private Integer timeSpentMin;
    private boolean backfilled;
    private String mood;

    // Section contents as separate fields for form handling
    private String task;
    private String input;
    private String output;
    private String sample;
    private String whatILearned;
    private String nextSteps;

    private Set<String> tags;
}