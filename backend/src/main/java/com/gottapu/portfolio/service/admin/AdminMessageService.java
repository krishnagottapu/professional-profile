package com.gottapu.portfolio.service.admin;

import com.gottapu.portfolio.entity.ContactMessage;
import com.gottapu.portfolio.repository.ContactMessageRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminMessageService {

    private final ContactMessageRepository contactMessageRepository;

    public AdminMessageService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    public ContactMessage getMessageById(Long id) {
        return contactMessageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));
    }

    public long getUnreadCount() {
        return contactMessageRepository.countByReadFalse();
    }

    @Transactional
    public ContactMessage markAsRead(Long id) {
        ContactMessage message = getMessageById(id);
        message.setRead(true);
        return contactMessageRepository.save(message);
    }

    @Transactional
    public void deleteMessage(Long id) {
        ContactMessage message = getMessageById(id);
        contactMessageRepository.delete(message);
    }
}
