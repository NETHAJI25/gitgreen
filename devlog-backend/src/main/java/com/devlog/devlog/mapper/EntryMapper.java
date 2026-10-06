package com.devlog.devlog.mapper;

import com.devlog.devlog.dto.EntryDTO;
import com.devlog.devlog.entity.Entry;
import com.devlog.devlog.entity.EntrySection;
import com.devlog.devlog.entity.Mood;
import com.devlog.devlog.entity.SectionType;
import com.devlog.devlog.entity.Tag;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class EntryMapper {

    public EntryDTO toDTO(Entry entry) {
        if (entry == null) return null;
        EntryDTO dto = new EntryDTO();
        dto.setId(entry.getId());
        dto.setDate(entry.getDate());
        dto.setProjectName(entry.getProjectName());
        dto.setLanguage(entry.getLanguage());
        dto.setTimeSpentMin(entry.getTimeSpentMin());
        dto.setBackfilled(entry.isBackfilled());
        dto.setMood(entry.getMood() != null ? entry.getMood().name() : null);
        dto.setTask(extractSection(entry, SectionType.TASK));
        dto.setInput(extractSection(entry, SectionType.INPUT));
        dto.setOutput(extractSection(entry, SectionType.OUTPUT));
        dto.setSample(extractSection(entry, SectionType.SAMPLE));
        dto.setWhatILearned(extractSection(entry, SectionType.WHAT_I_LEARNED));
        dto.setNextSteps(extractSection(entry, SectionType.NEXT_STEPS));
        if (entry.getTags() != null) {
            dto.setTags(entry.getTags().stream().map(Tag::getName).collect(Collectors.toSet()));
        }
        // fall back to transient fields when sections are not loaded (e.g. right after save)
        if (dto.getTask() == null) dto.setTask(entry.getTask());
        if (dto.getInput() == null) dto.setInput(entry.getInput());
        if (dto.getOutput() == null) dto.setOutput(entry.getOutput());
        if (dto.getSample() == null) dto.setSample(entry.getSample());
        if (dto.getWhatILearned() == null) dto.setWhatILearned(entry.getWhatILearned());
        if (dto.getNextSteps() == null) dto.setNextSteps(entry.getNextSteps());
        return dto;
    }

    public Entry toEntity(EntryDTO dto) {
        if (dto == null) return null;
        Entry entry = new Entry();
        entry.setId(dto.getId());
        entry.setDate(dto.getDate());
        entry.setProjectName(dto.getProjectName());
        entry.setLanguage(dto.getLanguage());
        entry.setTimeSpentMin(dto.getTimeSpentMin());
        entry.setBackfilled(dto.isBackfilled());
        if (dto.getMood() != null && !dto.getMood().isBlank()) {
            try {
                entry.setMood(Mood.valueOf(dto.getMood()));
            } catch (IllegalArgumentException ignored) {
            }
        }
        entry.setTask(dto.getTask());
        entry.setInput(dto.getInput());
        entry.setOutput(dto.getOutput());
        entry.setSample(dto.getSample());
        entry.setWhatILearned(dto.getWhatILearned());
        entry.setNextSteps(dto.getNextSteps());
        if (dto.getTags() != null) {
            Set<Tag> tags = dto.getTags().stream().map(name -> {
                Tag tag = new Tag();
                tag.setName(name);
                return tag;
            }).collect(Collectors.toSet());
            entry.setTags(tags);
        }
        return entry;
    }

    public void updateEntityFromDTO(EntryDTO dto, Entry entry) {
        if (dto == null || entry == null) return;
        if (dto.getDate() != null) entry.setDate(dto.getDate());
        if (dto.getProjectName() != null) entry.setProjectName(dto.getProjectName());
        if (dto.getLanguage() != null) entry.setLanguage(dto.getLanguage());
        if (dto.getTimeSpentMin() != null) entry.setTimeSpentMin(dto.getTimeSpentMin());
        entry.setBackfilled(dto.isBackfilled());
        if (dto.getMood() != null && !dto.getMood().isBlank()) {
            try {
                entry.setMood(Mood.valueOf(dto.getMood()));
            } catch (IllegalArgumentException ignored) {
            }
        }
        if (dto.getTask() != null) entry.setTask(dto.getTask());
        if (dto.getInput() != null) entry.setInput(dto.getInput());
        if (dto.getOutput() != null) entry.setOutput(dto.getOutput());
        if (dto.getSample() != null) entry.setSample(dto.getSample());
        if (dto.getWhatILearned() != null) entry.setWhatILearned(dto.getWhatILearned());
        if (dto.getNextSteps() != null) entry.setNextSteps(dto.getNextSteps());
    }

    private String extractSection(Entry entry, SectionType type) {
        if (entry.getSections() == null) return null;
        return entry.getSections().stream()
                .filter(s -> s.getType() == type)
                .map(EntrySection::getContent)
                .findFirst()
                .orElse(null);
    }
}
