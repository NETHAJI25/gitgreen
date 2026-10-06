package com.devlog.devlog.service;

import com.devlog.devlog.entity.Entry;
import com.devlog.devlog.entity.EntrySection;
import com.devlog.devlog.entity.SectionType;
import com.devlog.devlog.entity.Tag;
import com.devlog.devlog.entity.User;
import com.devlog.devlog.repository.EntryRepository;
import com.devlog.devlog.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntryService {

    private final EntryRepository entryRepository;
    private final TagRepository tagRepository;

    @Transactional
    public Entry saveEntry(User user, Entry entryData) {
        LocalDateTime now = LocalDateTime.now();
        entryData.setCreatedAt(now);
        entryData.setUpdatedAt(now);
        entryData.setUser(user);
        if (entryData.getDate() == null) {
            entryData.setDate(LocalDate.now());
        }

        Entry savedEntry = entryRepository.save(entryData);

        Set<EntrySection> sections = new LinkedHashSet<>();
        if (entryData.getTask() != null && !entryData.getTask().trim().isEmpty()) {
            sections.add(new EntrySection(null, savedEntry, SectionType.TASK, entryData.getTask(), 0));
        }
        if (entryData.getInput() != null && !entryData.getInput().trim().isEmpty()) {
            sections.add(new EntrySection(null, savedEntry, SectionType.INPUT, entryData.getInput(), 1));
        }
        if (entryData.getOutput() != null && !entryData.getOutput().trim().isEmpty()) {
            sections.add(new EntrySection(null, savedEntry, SectionType.OUTPUT, entryData.getOutput(), 2));
        }
        if (entryData.getSample() != null && !entryData.getSample().trim().isEmpty()) {
            sections.add(new EntrySection(null, savedEntry, SectionType.SAMPLE, entryData.getSample(), 3));
        }
        if (entryData.getWhatILearned() != null && !entryData.getWhatILearned().trim().isEmpty()) {
            sections.add(new EntrySection(null, savedEntry, SectionType.WHAT_I_LEARNED, entryData.getWhatILearned(), 4));
        }
        if (entryData.getNextSteps() != null && !entryData.getNextSteps().trim().isEmpty()) {
            sections.add(new EntrySection(null, savedEntry, SectionType.NEXT_STEPS, entryData.getNextSteps(), 5));
        }
        savedEntry.setSections(sections);

        if (entryData.getTags() != null && !entryData.getTags().isEmpty()) {
            Set<Tag> tags = entryData.getTags().stream()
                    .map(tag -> {
                        if (tag == null || tag.getName() == null) return null;
                        Optional<Tag> existingTag = tagRepository.findByName(tag.getName());
                        return existingTag.orElseGet(() -> {
                            tag.setId(null);
                            tag.setCreatedAt(now);
                            return tagRepository.save(tag);
                        });
                    })
                    .filter(t -> t != null)
                    .collect(Collectors.toSet());
            savedEntry.setTags(tags);
        }

        return entryRepository.save(savedEntry);
    }

    @Transactional(readOnly = true)
    public List<Entry> getEntriesByUser(User user) {
        return entryRepository.findByUserOrderByDateDesc(user);
    }

    @Transactional(readOnly = true)
    public List<Entry> getEntriesByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return entryRepository.findByUserAndDateBetween(user, startDate, endDate);
    }

    @Transactional(readOnly = true)
    public Entry getEntryById(Long id) {
        return entryRepository.findById(id).orElse(null);
    }

    @Transactional
    public void deleteEntry(Long id) {
        entryRepository.deleteById(id);
    }
}
