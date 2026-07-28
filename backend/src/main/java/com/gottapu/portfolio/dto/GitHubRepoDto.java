package com.gottapu.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GitHubRepoDto(
        Long id,
        String name,
        String description,
        @JsonProperty("html_url") String htmlUrl,
        String language,
        @JsonProperty("stargazers_count") int stargazersCount,
        @JsonProperty("forks_count") int forksCount,
        @JsonProperty("updated_at") String updatedAt
) {}
