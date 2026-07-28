---
id: task-07
task: Implement Spring Security session auth and admin CRUD REST API endpoints
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
    - backend/src/main/java/com/gottapu/portfolio/config/SecurityConfig.java
    - backend/src/main/java/com/gottapu/portfolio/controller/AuthController.java
    - backend/src/main/java/com/gottapu/portfolio/controller/admin/AdminBlogController.java
    - backend/src/main/java/com/gottapu/portfolio/controller/admin/AdminProjectController.java
    - backend/src/main/java/com/gottapu/portfolio/controller/admin/AdminSkillController.java
    - backend/src/main/java/com/gottapu/portfolio/controller/admin/AdminMessageController.java
    - backend/src/main/java/com/gottapu/portfolio/controller/admin/AdminDashboardController.java
    - backend/src/main/java/com/gottapu/portfolio/dto/LoginRequest.java
    - backend/src/main/java/com/gottapu/portfolio/dto/AdminBlogPostDto.java
    - backend/src/main/java/com/gottapu/portfolio/dto/AdminProjectDto.java
    - backend/src/main/java/com/gottapu/portfolio/dto/AdminSkillDto.java
    - backend/src/main/java/com/gottapu/portfolio/dto/DashboardStatsDto.java
    - backend/src/test/java/com/gottapu/portfolio/controller/AuthControllerTest.java
    - backend/src/test/java/com/gottapu/portfolio/controller/admin/AdminBlogControllerTest.java
acceptance_criteria:
  - POST /api/auth/login with valid credentials sets a session cookie and returns 200 with {username}
  - POST /api/auth/login with invalid credentials returns 401
  - GET /api/auth/me returns {username} when authenticated, 401 when not
  - POST /api/auth/logout invalidates session and returns 200
  - All /api/admin/** endpoints return 401 for unauthenticated requests
  - Admin blog CRUD — POST creates, GET lists all (including drafts), GET /{id} fetches, PUT updates, DELETE returns 204
  - Auto-generate slug from title if slug not provided in create request (lowercase, hyphens, stripped special chars)
  - Admin projects CRUD — full CRUD + PATCH /api/admin/projects/reorder for bulk sort order update
  - Admin skills CRUD — full CRUD
  - Admin messages — GET all, PATCH /{id}/read to toggle, DELETE /{id}
  - GET /api/admin/dashboard/stats returns totalPosts, unreadMessages, totalProjects
  - Spring Security does not redirect API calls to login page — returns 401 JSON for unauthenticated API requests
  - CSRF disabled for API (stateless JSON clients)
  - H2 console remains accessible (frameOptions set to SAMEORIGIN for /h2-console path)
  - MockMvc tests verify 401 for unauthenticated and 200 for authenticated admin blog endpoints
---

## Implementation Instructions

### 1. SecurityConfig.java

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin()) // allows H2 console
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/api/blog/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/projects/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/skills/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/github/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/me").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").authenticated()
                .requestMatchers("/api/auth/logout").authenticated()
                .anyRequest().authenticated()
            )
            .formLogin(login -> login.disable())   // disable default form login
            .httpBasic(basic -> basic.disable())   // disable basic auth
            .exceptionHandling(ex -> ex
                // Return 401 JSON instead of redirect for API paths
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}");
                })
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(
            @Value("${spring.security.user.name}") String username,
            @Value("${spring.security.user.password}") String password,
            PasswordEncoder encoder) {
        UserDetails admin = User.builder()
            .username(username)
            .password(encoder.encode(password))
            .roles("ADMIN")
            .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

### 2. AuthController.java

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        UsernamePasswordAuthenticationToken token =
            new UsernamePasswordAuthenticationToken(request.username(), request.password());

        try {
            Authentication auth = authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            // Create session
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext());
            return ResponseEntity.ok(Map.of("username", auth.getName()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of("username", principal.getName()));
    }
}
```

### 3. Admin Blog Service (additions to BlogService)

Add these methods to `BlogService`:
- `List<BlogPostDetailDto> getAllPostsForAdmin()` — returns all posts, no published filter
- `BlogPostDetailDto createPost(AdminBlogPostDto dto)` — generate slug if absent: `title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "")`; check slug uniqueness, append `-2`, `-3` if conflict
- `BlogPostDetailDto updatePost(Long id, AdminBlogPostDto dto)`
- `void deletePost(Long id)`

### 4. AdminBlogController.java

```java
@RestController
@RequestMapping("/api/admin/blog")
public class AdminBlogController {

    @GetMapping
    public List<BlogPostDetailDto> listAll() { ... }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlogPostDetailDto create(@Valid @RequestBody AdminBlogPostDto dto) { ... }

    @GetMapping("/{id}")
    public BlogPostDetailDto getById(@PathVariable Long id) { ... }

    @PutMapping("/{id}")
    public BlogPostDetailDto update(@PathVariable Long id, @Valid @RequestBody AdminBlogPostDto dto) { ... }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { ... }
}
```

### 5. AdminProjectController.java

Full CRUD at `/api/admin/projects` plus:
```java
@PatchMapping("/reorder")
public ResponseEntity<Void> reorder(@RequestBody List<Map<String, Integer>> items) {
    // items: [{ "id": 1, "sortOrder": 0 }, ...]
    projectService.bulkUpdateSortOrder(items);
    return ResponseEntity.ok().build();
}
```

### 6. AdminSkillController.java

Full CRUD at `/api/admin/skills`.

### 7. AdminMessageController.java

```java
@GetMapping
public List<ContactMessageResponseDto> listAll() { ... }

@GetMapping("/{id}")
public ContactMessageResponseDto getById(@PathVariable Long id) { ... }

@PatchMapping("/{id}/read")
public ContactMessageResponseDto toggleRead(@PathVariable Long id,
                                             @RequestBody Map<String, Boolean> body) { ... }

@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void delete(@PathVariable Long id) { ... }
```

### 8. AdminDashboardController.java

```java
@GetMapping("/api/admin/dashboard/stats")
public DashboardStatsDto getStats() {
    return new DashboardStatsDto(
        blogRepository.count(),
        contactMessageRepository.countByReadFalse(),
        projectRepository.count()
    );
}
```

### 9. DTOs

```java
public record LoginRequest(String username, String password) {}

public record AdminBlogPostDto(
    @NotBlank String title,
    String slug,
    String content,
    @Size(max = 500) String excerpt,
    boolean published
) {}

public record AdminProjectDto(
    @NotBlank String title,
    String description,
    List<String> techTags,
    String githubUrl,
    String liveUrl,
    boolean featured,
    int sortOrder
) {}

public record AdminSkillDto(
    @NotBlank String name,
    @NotBlank String category,
    @Min(0) @Max(100) int proficiency,
    int sortOrder
) {}

public record DashboardStatsDto(long totalPosts, long unreadMessages, long totalProjects) {}
```

### 10. Tests

**AuthControllerTest** (`@SpringBootTest @AutoConfigureMockMvc`):
- POST `/api/auth/login` with valid creds → 200 + session cookie
- POST `/api/auth/login` with wrong password → 401
- GET `/api/auth/me` without session → 401
- GET `/api/auth/me` with session → 200

**AdminBlogControllerTest** (`@WebMvcTest(AdminBlogController.class)` with `@WithMockUser(roles="ADMIN")`):
- GET `/api/admin/blog` as admin → 200
- GET `/api/admin/blog` without auth → 401
- POST `/api/admin/blog` with valid body as admin → 201
