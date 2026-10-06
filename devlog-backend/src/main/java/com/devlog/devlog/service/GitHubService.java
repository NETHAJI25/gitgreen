package com.devlog.devlog.service;

import com.devlog.devlog.entity.Entry;
import com.devlog.devlog.entity.EntrySection;
import com.devlog.devlog.entity.GitHubConnection;
import com.devlog.devlog.entity.RepoConfig;
import com.devlog.devlog.entity.User;
import com.devlog.devlog.repository.GitHubConnectionRepository;
import com.devlog.devlog.repository.RepoConfigRepository;
import lombok.RequiredArgsConstructor;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.transport.CredentialsProvider;
import org.eclipse.jgit.transport.URIish;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GitHubService {

    private final GitHubConnectionRepository gitHubConnectionRepository;
    private final RepoConfigRepository repoConfigRepository;

    @Value("${github.api.base-url:https://api.github.com}")
    private String githubApiBaseUrl;

    @Value("${devlog.journal.path:logs}")
    private String journalPath;

    @Value("${devlog.journal.java-practice-path:java-practice}")
    private String javaPracticePath;

    public GitHubConnection saveGitHubConnection(User user, String githubId, String accessToken, String tokenType, String scope) {
        GitHubConnection connection = gitHubConnectionRepository.findByUserId(user.getId())
                .orElse(new GitHubConnection());

        connection.setUser(user);
        connection.setGithubId(githubId);
        connection.setAccessToken(encryptToken(accessToken));
        connection.setTokenType(tokenType);
        connection.setScope(scope);
        connection.setUpdatedAt(LocalDateTime.now());

        if (connection.getId() == null) {
            connection.setCreatedAt(LocalDateTime.now());
        }

        return gitHubConnectionRepository.save(connection);
    }

    public Optional<GitHubConnection> getGitHubConnection(User user) {
        return gitHubConnectionRepository.findByUserId(user.getId());
    }

    public RepoConfig setupRepository(User user, String repoOwner, String repoName, boolean isPrivate, String branch) {
        RepoConfig config = repoConfigRepository.findByUserId(user.getId())
                .orElse(new RepoConfig());

        config.setUser(user);
        config.setRepoOwner(repoOwner);
        config.setRepoName(repoName);
        config.setPrivate(isPrivate);
        config.setBranch(branch != null && !branch.isEmpty() ? branch : "main");
        config.setUpdatedAt(LocalDateTime.now());

        if (config.getId() == null) {
            config.setCreatedAt(LocalDateTime.now());
            RepoConfig saved = repoConfigRepository.save(config);
            initializeRepository(user, saved);
            return saved;
        }

        return repoConfigRepository.save(config);
    }

    private void initializeRepository(User user, RepoConfig config) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("devlog-repo-");
            File repoDir = tempDir.toFile();
            Git git;

            try {
                git = Git.cloneRepository()
                        .setURI(getRepoUrl(config))
                        .setDirectory(repoDir)
                        .setCredentialsProvider(getCredentialsProvider(config))
                        .call();
            } catch (GitAPIException e) {
                git = Git.init().setDirectory(repoDir).call();
                git.remoteAdd()
                        .setName("origin")
                        .setUri(new URIish(getRepoUrl(config)))
                        .call();
            }

            git.getRepository().getConfig().setString("user", null, "name", "DevLog Bot");
            git.getRepository().getConfig().setString("user", null, "email", "devlog@example.com");
            git.getRepository().getConfig().save();

            Files.createDirectories(repoDir.toPath().resolve(journalPath));
            Files.createDirectories(repoDir.toPath().resolve(javaPracticePath));

            String readmeContent = generateInitialReadme(config);
            Path readmePath = repoDir.toPath().resolve("README.md");
            Files.writeString(readmePath, readmeContent, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            git.add().addFilepattern(".").call();
            git.commit().setMessage("Initial commit: DevLog setup").setAuthor("DevLog Bot", "devlog@example.com").call();

            try {
                git.push()
                        .setRemote("origin")
                        .setCredentialsProvider(getCredentialsProvider(config))
                        .call();
            } catch (Exception pushEx) {
                // Remote may not exist yet in dev; keep local commit
            }
            git.close();

        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize repository: " + e.getMessage(), e);
        } finally {
            if (tempDir != null) deleteDirectory(tempDir.toFile());
        }
    }

    public void saveEntryToRepo(User user, Entry entry) {
        Path tempDir = null;
        try {
            RepoConfig config = repoConfigRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("No repository configured for user"));

            tempDir = Files.createTempDirectory("devlog-entry-");
            Git git = Git.cloneRepository()
                    .setURI(getRepoUrl(config))
                    .setDirectory(tempDir.toFile())
                    .setCredentialsProvider(getCredentialsProvider(config))
                    .call();

            git.getRepository().getConfig().setString("user", null, "name", "DevLog Bot");
            git.getRepository().getConfig().setString("user", null, "email", "devlog@example.com");
            git.getRepository().getConfig().save();

            String entryContent = generateEntryMarkdown(entry);
            String filePath = String.format("%s/%04d/%02d/%s.md",
                    journalPath,
                    entry.getDate().getYear(),
                    entry.getDate().getMonthValue(),
                    entry.getDate());

            Path fullPath = tempDir.resolve(filePath);
            Files.createDirectories(fullPath.getParent());

            boolean fileExists = Files.exists(fullPath);
            String existingContent = fileExists ? Files.readString(fullPath) : "";

            String finalContent = fileExists
                    ? existingContent + "\n---\n\n" + entryContent
                    : entryContent;

            Files.writeString(fullPath, finalContent, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            git.add().addFilepattern(filePath).call();
            git.commit()
                    .setMessage(generateCommitMessage(entry))
                    .setAuthor("DevLog Bot", "devlog@example.com")
                    .call();

            int retries = 0;
            while (true) {
                try {
                    git.push()
                            .setRemote("origin")
                            .setCredentialsProvider(getCredentialsProvider(config))
                            .call();
                    break;
                } catch (Exception ex) {
                    if (++retries >= 3) throw ex;
                    git.pull().setRemote("origin").call();
                }
            }
            git.close();

        } catch (Exception e) {
            throw new RuntimeException("Failed to save entry to repository: " + e.getMessage(), e);
        } finally {
            if (tempDir != null) deleteDirectory(tempDir.toFile());
        }
    }

    private String generateEntryMarkdown(Entry entry) {
        StringBuilder sb = new StringBuilder();

        sb.append("---\n");
        sb.append(String.format("date: %s\n", entry.getDate()));
        if (entry.getProjectName() != null && !entry.getProjectName().isEmpty()) {
            sb.append(String.format("project: %s\n", entry.getProjectName()));
        }
        if (entry.getLanguage() != null && !entry.getLanguage().isEmpty()) {
            sb.append(String.format("language: %s\n", entry.getLanguage()));
        }
        sb.append(String.format("time_spent_min: %d\n", entry.getTimeSpentMin() != null ? entry.getTimeSpentMin() : 0));
        sb.append(String.format("backfilled: %b\n", entry.isBackfilled()));
        sb.append("---\n\n");

        if (entry.getSections() != null) {
            for (EntrySection section : entry.getSections()) {
                switch (section.getType()) {
                    case TASK -> sb.append("# What I worked on\n");
                    case INPUT -> sb.append("# Input\n");
                    case OUTPUT -> sb.append("# Output\n");
                    case SAMPLE -> sb.append("# Sample\n");
                    case WHAT_I_LEARNED -> sb.append("# What I learned\n");
                    case NEXT_STEPS -> sb.append("# Next steps\n");
                }
                sb.append(section.getContent()).append("\n\n");
            }
        }

        return sb.toString();
    }

    private String generateCommitMessage(Entry entry) {
        String projectPart = entry.getProjectName() != null && !entry.getProjectName().isEmpty()
                ? entry.getProjectName()
                : "general";
        return String.format("devlog: %s \u2013 %s", entry.getDate(), projectPart);
    }

    private String getRepoUrl(RepoConfig config) {
        String token = decryptToken(gitHubConnectionRepository.findByUserId(config.getUser().getId())
                .orElseThrow(() -> new RuntimeException("No GitHub connection found"))
                .getAccessToken());
        return String.format("https://%s@github.com/%s/%s.git",
                token, config.getRepoOwner(), config.getRepoName());
    }

    private CredentialsProvider getCredentialsProvider(RepoConfig config) {
        String token = decryptToken(gitHubConnectionRepository.findByUserId(config.getUser().getId())
                .orElseThrow(() -> new RuntimeException("No GitHub connection found"))
                .getAccessToken());
        return new UsernamePasswordCredentialsProvider(token, "x-oauth-basic");
    }

    private String encryptToken(String token) {
        return Base64.getEncoder().encodeToString(token.getBytes());
    }

    private String decryptToken(String encryptedToken) {
        return new String(Base64.getDecoder().decode(encryptedToken));
    }

    private String generateInitialReadme(RepoConfig config) {
        return String.format("# %s%n%nThis repository tracks my daily development journal using DevLog.%n%n## About DevLog%nDevLog is a developer journal application that helps track daily work, inputs, outputs, and learnings. Each day's work is saved as a markdown file and committed to this repository.%n%n## Journal Entries%nJournal entries are stored in the `%s` directory, organized by year and month.%n%n## Java Practice%nJava exercises and practice are stored in the `%s` directory.%n%n---%n*Managed by DevLog*%n",
                config.getRepoName(), journalPath, javaPracticePath);
    }

    private void deleteDirectory(File directory) {
        if (directory.exists()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        deleteDirectory(file);
                    } else {
                        file.delete();
                    }
                }
            }
            directory.delete();
        }
    }
}
