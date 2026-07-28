package com.gottapu.portfolio.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailService, "adminEmail", "admin@example.com");
        ReflectionTestUtils.setField(emailService, "fromEmail", "noreply@example.com");
    }

    @Test
    @DisplayName("sendContactNotification sends email with correct fields")
    void sendContactNotification_sendsEmailWithCorrectFields() {
        emailService.sendContactNotification("John Doe", "john@example.com", "Hello, this is a test message.");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();

        assertEquals("admin@example.com", sent.getTo()[0]);
        assertEquals("noreply@example.com", sent.getFrom());
        assertEquals("New Contact Form Submission from John Doe", sent.getSubject());
        assertTrue(sent.getText().contains("John Doe"));
        assertTrue(sent.getText().contains("john@example.com"));
        assertTrue(sent.getText().contains("Hello, this is a test message."));
    }

    @Test
    @DisplayName("sendContactNotification uses adminEmail as from when fromEmail is blank")
    void sendContactNotification_usesAdminEmailAsFallbackFrom() {
        ReflectionTestUtils.setField(emailService, "fromEmail", "");

        emailService.sendContactNotification("Jane Doe", "jane@example.com", "Test message");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();

        assertEquals("admin@example.com", sent.getFrom());
    }

    @Test
    @DisplayName("sendContactNotification gracefully handles MailException without throwing")
    void sendContactNotification_gracefullyHandlesMailException() {
        doThrow(new MailSendException("SMTP connection refused"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        assertDoesNotThrow(() ->
                emailService.sendContactNotification("Error User", "error@example.com", "This will fail")
        );
    }
}
