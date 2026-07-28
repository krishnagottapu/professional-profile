package com.gottapu.portfolio.controller;

import com.gottapu.portfolio.dto.GitHubRepoDto;
import com.gottapu.portfolio.service.GitHubService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/github")
public class GitHubController {

    private final GitHubService gitHubService;

    public GitHubController(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
    }

    @GetMapping("/repos")
    public ResponseEntity<List<GitHubRepoDto>> getRepos() {
        return ResponseEntity.ok(gitHubService.getRepos());
    }
}
