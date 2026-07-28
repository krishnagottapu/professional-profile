package com.gottapu.portfolio.service;

import com.gottapu.portfolio.dto.ProjectDto;
import com.gottapu.portfolio.entity.Project;
import com.gottapu.portfolio.repository.ProjectRepository;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAllByOrderBySortOrderAsc().stream()
                .map(this::toDto)
                .toList();
    }

    private ProjectDto toDto(Project project) {
        List<String> tags = project.getTechTags() != null && !project.getTechTags().isBlank()
                ? Arrays.stream(project.getTechTags().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList()
                : Collections.emptyList();

        return new ProjectDto(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                tags,
                project.getGithubUrl(),
                project.getDemoUrl(),
                project.isFeatured(),
                project.getSortOrder()
        );
    }
}
