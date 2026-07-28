---
id: task-05
task: Implement JPA entities, repositories, and seed data for H2 database
agent: backend
status: approved
depends_on: []
skills:
  - languages/java
  - tooling/checkstyle
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - backend/src/main/java/com/gottapu/portfolio/entity/BlogPost.java
    - backend/src/main/java/com/gottapu/portfolio/entity/Project.java
    - backend/src/main/java/com/gottapu/portfolio/entity/Skill.java
    - backend/src/main/java/com/gottapu/portfolio/entity/ContactMessage.java
    - backend/src/main/java/com/gottapu/portfolio/repository/BlogPostRepository.java
    - backend/src/main/java/com/gottapu/portfolio/repository/ProjectRepository.java
    - backend/src/main/java/com/gottapu/portfolio/repository/SkillRepository.java
    - backend/src/main/java/com/gottapu/portfolio/repository/ContactMessageRepository.java
    - backend/src/main/resources/data.sql
    - backend/src/test/java/com/gottapu/portfolio/repository/SkillRepositoryTest.java
acceptance_criteria:
  - H2 file-based database configured at jdbc:h2:file:./data/portfolio
  - H2 console accessible at /h2-console in dev
  - BlogPost entity has id, title, slug (unique), content, excerpt, published, createdAt, updatedAt
  - Project entity has id, title, description, techTags, githubUrl, liveUrl, featured, sortOrder
  - Skill entity has id, name, category, proficiency (0–100), sortOrder
  - ContactMessage entity has id, name, email, message, read, createdAt
  - BlogPostRepository: findBySlug(String) and findAllByPublishedTrueOrderByCreatedAtDesc with Pageable
  - ProjectRepository: findAllByOrderBySortOrderAsc
  - SkillRepository: findAllByOrderByCategoryAscSortOrderAsc
  - ContactMessageRepository: findAllByOrderByCreatedAtDesc and countByReadFalse
  - data.sql seeds all 25 skills from requirements (7 categories, correct proficiency values)
  - Application starts without errors and H2 console shows all four tables with seed data
  - Unit test verifies SkillRepository returns skills grouped correctly
---

## Implementation Instructions

### 1. Entity: `BlogPost.java`

```java
package com.gottapu.portfolio.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blog_post")
public class BlogPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String content;

    @Column(length = 500)
    private String excerpt;

    @Column(nullable = false)
    private boolean published = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and setters for all fields
}
```

### 2. Entity: `Project.java`

```java
@Entity
@Table(name = "project")
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String title;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(length = 500) private String techTags;   // comma-separated
    @Column(length = 500) private String githubUrl;
    @Column(length = 500) private String liveUrl;
    @Column(nullable = false) private boolean featured = false;
    @Column(nullable = false) private int sortOrder = 0;
    // Getters and setters
}
```

### 3. Entity: `Skill.java`

```java
@Entity
@Table(name = "skill")
public class Skill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String category;
    @Column(nullable = false) private int proficiency;   // 0–100
    @Column(nullable = false) private int sortOrder = 0;
    // Getters and setters
}
```

### 4. Entity: `ContactMessage.java`

```java
@Entity
@Table(name = "contact_message")
public class ContactMessage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String email;
    @Column(nullable = false, columnDefinition = "TEXT") private String message;
    @Column(nullable = false) private boolean read = false;
    @Column(nullable = false, updatable = false) private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
    // Getters and setters
}
```

### 5. Repositories

```java
// BlogPostRepository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlug(String slug);
    Page<BlogPost> findAllByPublishedTrueOrderByCreatedAtDesc(Pageable pageable);
}

// ProjectRepository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderBySortOrderAsc();
}

// SkillRepository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findAllByOrderByCategoryAscSortOrderAsc();
}

// ContactMessageRepository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    long countByReadFalse();
}
```

### 6. `data.sql` Seed Data

Replace the existing empty `data.sql` with full skill seeds. Use `MERGE INTO` (H2-compatible upsert) to avoid duplicate inserts on restart:

```sql
-- Skills seed data (use INSERT IF NOT EXISTS pattern for H2)
MERGE INTO skill (id, name, category, proficiency, sort_order)
KEY (id)
VALUES
  (1,  'MCP',                'AI & Architecture', 90, 1),
  (2,  'LLM Integration',    'AI & Architecture', 85, 2),
  (3,  'Prompt Engineering', 'AI & Architecture', 80, 3),
  (4,  'Java',               'Languages',         95, 1),
  (5,  'Python',             'Languages',         75, 2),
  (6,  'SQL',                'Languages',         85, 3),
  (7,  'JavaScript',         'Languages',         80, 4),
  (8,  'Spring Boot',        'Frameworks',        95, 1),
  (9,  'Hibernate',          'Frameworks',        90, 2),
  (10, 'Atlassian SDK',      'Frameworks',        85, 3),
  (11, 'Angular',            'Frameworks',        80, 4),
  (12, 'Oracle',             'Databases',         80, 1),
  (13, 'MySQL',              'Databases',         85, 2),
  (14, 'MongoDB',            'Databases',         75, 3),
  (15, 'SQL Server',         'Databases',         70, 4),
  (16, 'Docker',             'DevOps',            80, 1),
  (17, 'Jenkins',            'DevOps',            75, 2),
  (18, 'GitLab CI/CD',       'DevOps',            75, 3),
  (19, 'Kafka',              'Messaging',         80, 1),
  (20, 'JMS',                'Messaging',         70, 2),
  (21, 'RabbitMQ',           'Messaging',         70, 3),
  (22, 'JUnit',              'Testing',           90, 1),
  (23, 'Mockito',            'Testing',           85, 2),
  (24, 'Playwright',         'Testing',           80, 3),
  (25, 'Selenium',           'Testing',           75, 4);
```

### 7. Unit Test: `SkillRepositoryTest.java`

Use `@DataJpaTest` with the H2 test profile:

```java
@DataJpaTest
class SkillRepositoryTest {
    @Autowired SkillRepository skillRepository;

    @Test
    void findAllByOrderByCategoryAscSortOrderAsc_returnsAllSkillsSorted() {
        List<Skill> skills = skillRepository.findAllByOrderByCategoryAscSortOrderAsc();
        assertFalse(skills.isEmpty());
        // Verify "AI & Architecture" comes before "Databases" alphabetically
        String firstCategory = skills.get(0).getCategory();
        assertTrue(skills.stream().anyMatch(s -> s.getCategory().equals("Languages")));
    }

    @Test
    void findBySlug_returnsEmptyForNonExistent() {
        // Verify BlogPostRepository behavior via a similar pattern
    }
}
```

### Configuration Notes

- `application.yml` already has `spring.sql.init.mode: always` and `defer-datasource-initialization: true` — these are correct for `data.sql` seeding with JPA
- `ddl-auto: update` means Hibernate creates tables on first start; `data.sql` runs after schema creation
- Do NOT use `ddl-auto: create-drop` — that would wipe data on restart
