package com.gottapu.portfolio.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class EmailServiceTest {

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService();
        ReflectionTestUtils.setField(emailService, "adminEmail", "admin@example.com");
        ReflectionTestUtils.setField(emailService, "resendApiKey", "");
        ReflectionTestUtils.setField(emailService, "fromEmail", "Portfolio <onboarding@resend.dev>");
    }

    @Test
    @DisplayName("sendContactNotification skips gracefully when API key is not configured")
    void sendContactNotification_skipsWhenNoApiKey() {
        assertDoesNotThrow(() ->
                emailService.sendContactNotification("John Doe", "john@example.com", "Hello, this is a test message.")
        );
    }

    @Test
    @DisplayName("sendContactNotification handles errors gracefully without throwing")
    void sendContactNotification_gracefullyHandlesError() {
        ReflectionTestUtils.setField(emailService, "resendApiKey", "re_invalid_key");

        assertDoesNotThrow(() ->
                emailService.sendContactNotification("Error User", "error@example.com", "This will fail")
        );
    }
}
