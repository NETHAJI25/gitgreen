package com.devlog.devlog.repository;

import com.devlog.devlog.entity.EntrySection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntrySectionRepository extends JpaRepository<EntrySection, Long> {
}
