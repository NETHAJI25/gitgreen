package com.devlog.devlog.repository;

import com.devlog.devlog.entity.GitHubConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GitHubConnectionRepository extends JpaRepository<GitHubConnection, Long> {
    Optional<GitHubConnection> findByUserId(Long userId);
}
