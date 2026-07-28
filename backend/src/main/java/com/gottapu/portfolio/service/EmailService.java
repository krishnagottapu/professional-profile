package com.gottapu.portfolio.service;

import com.gottapu.portfolio.entity.ContactMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

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
    public void sendContactNotification(String senderName, String senderEmail, String messageBody) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(adminEmail);
            mail.setFrom(fromEmail.isBlank() ? adminEmail : fromEmail);
            mail.setSubject("New Contact Form Submission from " + senderName);
            mail.setText(buildEmailBody(senderName, senderEmail, messageBody));
            mailSender.send(mail);
            log.info("Contact notification email sent for sender: {}", senderName);
        } catch (MailException e) {
            log.warn("Failed to send contact email notification for sender {}: {}",
                    senderName, e.getMessage());
        }
    }

    private String buildEmailBody(String senderName, String senderEmail, String messageBody) {
        return String.format(
                "New contact form submission from your portfolio website.%n%n"
                        + "From: %s%n"
                        + "Email: %s%n%n"
                        + "Message:%n%s",
                senderName,
                senderEmail,
                messageBody
        );
    }
}
