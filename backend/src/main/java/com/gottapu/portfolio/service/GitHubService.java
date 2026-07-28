package com.gottapu.portfolio.service;

import com.gottapu.portfolio.dto.GitHubRepoDto;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GitHubService {

    private static final Logger log = LoggerFactory.getLogger(GitHubService.class);
    private static final String GITHUB_API_URL =
            "https://api.github.com/users/krishnagottapu/repos?per_page=100&sort=updated";
    private static final long CACHE_TTL_SECONDS = 3600;
    private static final String CACHE_KEY = "repos";

    private final RestClient restClient;
    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public GitHubService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .defaultHeader(HttpHeaders.USER_AGENT, "portfolio-backend")
                .build();
    }

    public List<GitHubRepoDto> getRepos() {
        CacheEntry entry = cache.get(CACHE_KEY);

        if (entry != null && !entry.isExpired()) {
            return entry.data();
        }

        try {
            List<GitHubRepoDto> repos = restClient.get()
                    .uri(GITHUB_API_URL)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});

            if (repos != null) {
                cache.put(CACHE_KEY, new CacheEntry(repos, Instant.now()));
                return repos;
            }
        } catch (Exception ex) {
            log.warn("Failed to fetch GitHub repos: {}", ex.getMessage());
        }

        // Return cached data if available, otherwise empty list
        if (entry != null) {
            return entry.data();
        }
        return Collections.emptyList();
    }

    private record CacheEntry(List<GitHubRepoDto> data, Instant timestamp) {
        boolean isExpired() {
            return Instant.now().isAfter(timestamp.plusSeconds(CACHE_TTL_SECONDS));
        }
    }
}
