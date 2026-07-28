package com.gottapu.portfolio.service;

import com.gottapu.portfolio.dto.ContactRequest;
import com.gottapu.portfolio.dto.ContactResponse;
import com.gottapu.portfolio.entity.ContactMessage;
import com.gottapu.portfolio.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository contactMessageRepository,
                          EmailService emailService) {
        this.contactMessageRepository = contactMessageRepository;
        this.emailService = emailService;
    }

    public ContactResponse saveMessage(ContactRequest request) {
        ContactMessage entity = new ContactMessage();
        entity.setName(request.name());
        entity.setEmail(request.email());
        entity.setMessage(request.message());
        contactMessageRepository.save(entity);

        // Async email — does not block response, graceful failure handled in EmailService
        emailService.sendContactNotification(request.name(), request.email(), request.message());

        return new ContactResponse(true, "Message sent successfully");
    }
}
