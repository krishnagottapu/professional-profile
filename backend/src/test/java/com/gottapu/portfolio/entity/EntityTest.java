package com.gottapu.portfolio.entity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

class EntityTest {

    @Test
    void blogPost_defaultValues() {
        BlogPost post = new BlogPost();

        assertNull(post.getId());
        assertNull(post.getTitle());
        assertNull(post.getSlug());
        assertNull(post.getContent());
        assertNull(post.getExcerpt());
        assertFalse(post.isPublished());
        assertNull(post.getCreatedAt());
        assertNull(post.getUpdatedAt());
        assertEquals(0, post.getReadTimeMinutes());
    }

    @Test
    void project_defaultValues() {
        Project project = new Project();

        assertNull(project.getId());
        assertNull(project.getTitle());
        assertNull(project.getDescription());
        assertNull(project.getTechTags());
        assertNull(project.getGithubUrl());
        assertNull(project.getDemoUrl());
        assertFalse(project.isFeatured());
        assertEquals(0, project.getSortOrder());
        assertNull(project.getCreatedAt());
    }

    @Test
    void skill_defaultValues() {
        Skill skill = new Skill();

        assertNull(skill.getId());
        assertNull(skill.getName());
        assertNull(skill.getCategory());
        assertEquals(0, skill.getProficiency());
        assertEquals(0, skill.getSortOrder());
    }

    @Test
    void contactMessage_defaultValues() {
        ContactMessage message = new ContactMessage();

        assertNull(message.getId());
        assertNull(message.getName());
        assertNull(message.getEmail());
        assertNull(message.getMessage());
        assertFalse(message.isRead());
        assertNull(message.getCreatedAt());
    }

    @Test
    void blogPost_settersAndGetters() {
        BlogPost post = new BlogPost();
        post.setTitle("Test Title");
        post.setSlug("test-title");
        post.setContent("<p>Hello</p>");
        post.setExcerpt("A short excerpt");
        post.setPublished(true);
        post.setReadTimeMinutes(5);

        assertEquals("Test Title", post.getTitle());
        assertEquals("test-title", post.getSlug());
        assertEquals("<p>Hello</p>", post.getContent());
        assertEquals("A short excerpt", post.getExcerpt());
        assertEquals(true, post.isPublished());
        assertEquals(5, post.getReadTimeMinutes());
    }

    @Test
    void project_settersAndGetters() {
        Project project = new Project();
        project.setTitle("My Project");
        project.setDescription("A project description");
        project.setTechTags("Java,Spring Boot");
        project.setGithubUrl("https://github.com/user/repo");
        project.setDemoUrl("https://example.com");
        project.setFeatured(true);
        project.setSortOrder(3);

        assertEquals("My Project", project.getTitle());
        assertEquals("A project description", project.getDescription());
        assertEquals("Java,Spring Boot", project.getTechTags());
        assertEquals("https://github.com/user/repo", project.getGithubUrl());
        assertEquals("https://example.com", project.getDemoUrl());
        assertEquals(true, project.isFeatured());
        assertEquals(3, project.getSortOrder());
    }

    @Test
    void skill_settersAndGetters() {
        Skill skill = new Skill();
        skill.setName("Java");
        skill.setCategory("Languages");
        skill.setProficiency(95);
        skill.setSortOrder(1);

        assertEquals("Java", skill.getName());
        assertEquals("Languages", skill.getCategory());
        assertEquals(95, skill.getProficiency());
        assertEquals(1, skill.getSortOrder());
    }

    @Test
    void contactMessage_settersAndGetters() {
        ContactMessage message = new ContactMessage();
        message.setName("John Doe");
        message.setEmail("john@example.com");
        message.setMessage("Hello there!");
        message.setRead(true);

        assertEquals("John Doe", message.getName());
        assertEquals("john@example.com", message.getEmail());
        assertEquals("Hello there!", message.getMessage());
        assertEquals(true, message.isRead());
    }
}
