package com.devlog.devlog.repository;

import com.devlog.devlog.entity.RepoConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepoConfigRepository extends JpaRepository<RepoConfig, Long> {
    Optional<RepoConfig> findByUserId(Long userId);
}
