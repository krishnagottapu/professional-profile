---
id: task-08
task: Implement async email notification service for contact form submissions
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
    - backend/src/main/java/com/gottapu/portfolio/service/EmailService.java
    - backend/src/main/java/com/gottapu/portfolio/config/AsyncConfig.java
    - backend/src/test/java/com/gottapu/portfolio/service/EmailServiceTest.java
acceptance_criteria:
  - EmailService.sendContactNotification(ContactMessage) is annotated @Async
  - Email is sent to ADMIN_EMAIL (from application.yml app.admin.email)
  - Email subject includes sender name
  - Email body includes sender name, email address, and full message
  - MailException is caught and logged as WARN — never propagated to caller
  - ContactService saves ContactMessage to DB before calling EmailService (DB save is not contingent on email)
  - @EnableAsync is present on PortfolioApplication
  - AsyncConfig provides a named ThreadPoolTaskExecutor bean "emailExecutor"
  - Unit test mocks JavaMailSender and verifies email construction; verifies graceful failure on MailException
---

## Implementation Instructions

### 1. AsyncConfig.java

```java
@Configuration
public class AsyncConfig implements AsyncConfigurer {

    @Bean(name = "emailExecutor")
    public TaskExecutor emailExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("email-");
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) ->
            LoggerFactory.getLogger(AsyncConfig.class)
                .error("Uncaught async exception in {}: {}", method.getName(), ex.getMessage(), ex);
    }
}
```

### 2. EmailService.java

```java
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async("emailExecutor")
    public void sendContactNotification(ContactMessage message) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(adminEmail);
            mail.setFrom(fromEmail.isBlank() ? adminEmail : fromEmail);
            mail.setSubject("Portfolio Contact: New message from " + message.getName());
            mail.setText(buildEmailBody(message));
            mailSender.send(mail);
            log.info("Contact notification sent for message id={}", message.getId());
        } catch (MailException e) {
            // Graceful failure: log and continue. Message already persisted in DB.
            log.warn("Failed to send contact email notification for message id={}: {}",
                message.getId(), e.getMessage());
        }
    }

    private String buildEmailBody(ContactMessage message) {
        return String.format(
            "New contact form submission from your portfolio website.%n%n" +
            "From: %s%n" +
            "Email: %s%n%n" +
            "Message:%n%s%n%n" +
            "----%n" +
            "Submitted at: %s",
            message.getName(),
            message.getEmail(),
            message.getMessage(),
            message.getCreatedAt().toString()
        );
    }
}
```

### 3. Update ContactService (from task-06)

Ensure the service follows this pattern:

```java
@Service
public class ContactService {

    private final ContactMessageRepository repository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public ContactMessage submitContact(ContactMessageDto dto) {
        ContactMessage entity = new ContactMessage();
        entity.setName(dto.name());
        entity.setEmail(dto.email());
        entity.setMessage(dto.message());
        // Save FIRST — email is best-effort
        ContactMessage saved = repository.save(entity);
        // Fire-and-forget async email
        emailService.sendContactNotification(saved);
        return saved;
    }
}
```

### 4. Security Notes

- Email body must NOT include the honeypot field value
- fromEmail defaults to adminEmail if SMTP username is blank (avoids NullPointerException in dev with no SMTP config)
- Do NOT log the full message content at INFO level — only log message IDs

### 5. Unit Test: EmailServiceTest.java

```java
@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    JavaMailSender mailSender;

    @InjectMocks
    EmailService emailService;

    @BeforeEach
    void setup() {
        ReflectionTestUtils.setField(emailService, "adminEmail", "test@example.com");
        ReflectionTestUtils.setField(emailService, "fromEmail", "from@example.com");
    }

    @Test
    void sendContactNotification_sendsEmailWithCorrectFields() {
        ContactMessage msg = new ContactMessage();
        msg.setId(1L);
        msg.setName("Test User");
        msg.setEmail("user@example.com");
        msg.setMessage("Hello there");
        msg.setCreatedAt(LocalDateTime.now());

        // Call directly (not async in test — @Async is intercepted by Spring context)
        emailService.sendContactNotification(msg);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();

        assertEquals("test@example.com", sent.getTo()[0]);
        assertTrue(sent.getSubject().contains("Test User"));
        assertTrue(sent.getText().contains("user@example.com"));
        assertTrue(sent.getText().contains("Hello there"));
    }

    @Test
    void sendContactNotification_gracefullyHandlesMailException() {
        doThrow(new MailSendException("SMTP unavailable")).when(mailSender).send(any(SimpleMailMessage.class));

        ContactMessage msg = new ContactMessage();
        msg.setId(2L);
        msg.setName("Another User");
        msg.setEmail("another@example.com");
        msg.setMessage("Test message");
        msg.setCreatedAt(LocalDateTime.now());

        // Should NOT throw — MailException is caught internally
        assertDoesNotThrow(() -> emailService.sendContactNotification(msg));
    }
}
```

### 6. Application-level async config

`PortfolioApplication.java` already has `@EnableAsync` — confirm it is present. No changes needed to the main class.
