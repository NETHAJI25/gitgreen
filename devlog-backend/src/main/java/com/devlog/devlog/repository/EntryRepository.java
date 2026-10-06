package com.devlog.devlog.repository;

import com.devlog.devlog.entity.Entry;
import com.devlog.devlog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long> {
    List<Entry> findByUserOrderByDateDesc(User user);
    List<Entry> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}