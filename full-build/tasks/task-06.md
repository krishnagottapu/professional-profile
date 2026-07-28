---
id: task-06
task: Implement public REST API endpoints for blog, projects, skills, contact, and GitHub proxy
agent: backend
status: approved
depends_on: [task-05]
skills:
  - languages/java
  - tooling/checkstyle
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - backend/src/main/java/com/gottapu/portfolio/dto/BlogPostDto.java
    - backend/src/main/java/com/gottapu/portfolio/dto/BlogPostDetailDto.java
    - backend/src/main/java/com/gottapu/portfolio/dto/ProjectDto.java
    - backend/src/main/java/com/gottapu/portfolio/dto/SkillDto.java
    - backend/src/main/java/com/gottapu/portfolio/dto/SkillsByCategoryDto.java
    - backend/src/main/java/com/gottapu/portfolio/dto/ContactMessageDto.java
    - backend/src/main/java/com/gottapu/portfolio/dto/GitHubRepoDto.java
    - backend/src/main/java/com/gottapu/portfolio/service/BlogService.java
    - backend/src/main/java/com/gottapu/portfolio/service/ProjectService.java
    - backend/src/main/java/com/gottapu/portfolio/service/SkillService.java
    - backend/src/main/java/com/gottapu/portfolio/service/ContactService.java
    - backend/src/main/java/com/gottapu/portfolio/service/GitHubService.java
    - backend/src/main/java/com/gottapu/portfolio/controller/BlogController.java
    - backend/src/main/java/com/gottapu/portfolio/controller/ProjectController.java
    - backend/src/main/java/com/gottapu/portfolio/controller/SkillController.java
    - backend/src/main/java/com/gottapu/portfolio/controller/ContactController.java
    - backend/src/main/java/com/gottapu/portfolio/controller/GitHubController.java
    - backend/src/main/java/com/gottapu/portfolio/exception/GlobalExceptionHandler.java
    - backend/src/main/java/com/gottapu/portfolio/exception/ResourceNotFoundException.java
    - backend/src/main/java/com/gottapu/portfolio/config/WebConfig.java
    - backend/src/test/java/com/gottapu/portfolio/controller/BlogControllerTest.java
    - backend/src/test/java/com/gottapu/portfolio/controller/ContactControllerTest.java
acceptance_criteria:
  - GET /api/blog returns paginated published posts (page, size query params; default page=0 size=10)
  - GET /api/blog/{slug} returns full post or 404 if not found or not published
  - GET /api/projects returns all projects sorted by sortOrder ASC
  - GET /api/skills returns skills grouped by category as array of {category, skills[]}
  - POST /api/contact validates name/email/message; rejects if honeypot field is populated; saves message to DB; returns 201
  - GET /api/github/repos returns cached GitHub repos for user krishnagottapu; returns empty array on GitHub API failure
  - GitHub cache TTL is 1 hour; no external cache library required
  - CORS allows http://localhost:3000 for all /api/** paths
  - Global exception handler returns consistent JSON error shape for 400, 404, 500
  - Bean Validation errors return 400 with field-level messages
  - MockMvc tests cover happy path and validation rejection for BlogController and ContactController
---

## Implementation Instructions

### 1. DTOs

**BlogPostDto** (list view — no content field):
```java
public record BlogPostDto(Long id, String title, String slug, String excerpt,
                           boolean published, LocalDateTime createdAt, LocalDateTime updatedAt) {}
```

**BlogPostDetailDto** (full post):
```java
public record BlogPostDetailDto(Long id, String title, String slug, String content,
                                 String excerpt, boolean published,
                                 LocalDateTime createdAt, LocalDateTime updatedAt) {}
```

**ProjectDto**:
```java
public record ProjectDto(Long id, String title, String description, List<String> techTags,
                          String githubUrl, String liveUrl, boolean featured, int sortOrder) {}
```
Note: `techTags` is stored as comma-separated string in DB; split in service layer.

**SkillDto**:
```java
public record SkillDto(Long id, String name, String category, int proficiency, int sortOrder) {}
```

**SkillsByCategoryDto**:
```java
public record SkillsByCategoryDto(String category, List<SkillDto> skills) {}
```

**ContactMessageDto** (inbound request):
```java
public record ContactMessageDto(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Email String email,
    @NotBlank @Size(max = 2000) String message,
    String honeypot    // must be empty/null to pass
) {}
```

**GitHubRepoDto**:
```java
public record GitHubRepoDto(Long id, String name, String description,
                              String htmlUrl, String language,
                              int stargazersCount, int forksCount, List<String> topics) {}
```

### 2. Services

**BlogService**:
- `Page<BlogPostDto> getPublishedPosts(int page, int size)` — map entity to DTO
- `BlogPostDetailDto getPublishedPostBySlug(String slug)` — throw `ResourceNotFoundException` if absent or not published

**ProjectService**:
- `List<ProjectDto> getAllProjects()` — split techTags by comma, trim

**SkillService**:
- `List<SkillsByCategoryDto> getSkillsByCategory()` — fetch all, group by category using Java stream `Collectors.groupingBy`

**ContactService**:
- `ContactMessage submitContact(ContactMessageDto dto)` — validate honeypot is blank, save entity, call `emailService.sendContactNotification(saved)` asynchronously

**GitHubService**:
- Use Spring Boot 3.x `RestClient` (not deprecated `RestTemplate`)
- Cache structure: `Map<String, Object[]> cache` where value is `[List<GitHubRepoDto>, Instant timestamp]`
- `List<GitHubRepoDto> getRepos()`: check cache → if stale or empty, fetch → on error return cached or empty list
- GitHub API URL: `https://api.github.com/users/krishnagottapu/repos?per_page=100&sort=updated`
- Set `User-Agent: portfolio-backend` header (GitHub requires this)
- Map response JSON to `GitHubRepoDto` — use `@JsonProperty` for snake_case field names

### 3. Controllers

**BlogController** (`@RestController @RequestMapping("/api/blog")`):
```java
@GetMapping
public ResponseEntity<Page<BlogPostDto>> getPosts(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) { ... }

@GetMapping("/{slug}")
public ResponseEntity<BlogPostDetailDto> getPost(@PathVariable String slug) { ... }
```

**ProjectController** (`@GetMapping("/api/projects")`):
Returns `List<ProjectDto>`.

**SkillController** (`@GetMapping("/api/skills")`):
Returns `List<SkillsByCategoryDto>`.

**ContactController** (`@PostMapping("/api/contact")`):
```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public Map<String, Object> submitContact(@Valid @RequestBody ContactMessageDto dto) {
    if (dto.honeypot() != null && !dto.honeypot().isBlank()) {
        return Map.of("id", -1, "message", "Sent"); // silent discard
    }
    var saved = contactService.submitContact(dto);
    return Map.of("id", saved.getId(), "message", "Sent");
}
```

**GitHubController** (`@GetMapping("/api/github/repos")`):
Returns `List<GitHubRepoDto>`.

### 4. Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleNotFound(ResourceNotFoundException ex) {
        return buildError(404, "Not Found", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(e -> fields.put(e.getField(), e.getDefaultMessage()));
        Map<String, Object> body = buildError(400, "Validation Failed", "Request validation failed");
        body.put("fields", fields);
        return body;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, Object> handleGeneral(Exception ex) {
        // Log internally, return generic message (do NOT expose stack trace)
        return buildError(500, "Internal Server Error", "An unexpected error occurred");
    }

    private Map<String, Object> buildError(int status, String error, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status);
        body.put("error", error);
        body.put("message", message);
        body.put("timestamp", Instant.now().toString());
        return body;
    }
}
```

### 5. WebConfig (CORS)

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

### 6. MockMvc Tests

**BlogControllerTest**: `@WebMvcTest(BlogController.class)`
- `GET /api/blog` with mock `BlogService.getPublishedPosts` → 200 with paginated response
- `GET /api/blog/nonexistent` → 404

**ContactControllerTest**: `@WebMvcTest(ContactController.class)`
- Valid POST → 201 with `{ id, message }`
- Missing name → 400 with field error
- Invalid email → 400 with field error
- Populated honeypot → silently returns 201 but does not call service

### Security Note

The `ResourceNotFoundException` message must not include internal DB details — only expose resource type and identifier (e.g., "Blog post not found: {slug}"). The generic exception handler must NOT include stack traces or exception class names in the response body.
