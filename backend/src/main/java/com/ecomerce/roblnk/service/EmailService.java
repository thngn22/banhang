package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.auth.EmailDetails;
import org.springframework.http.ResponseEntity;

public interface EmailService {

    ResponseEntity<?> sendSimpleMail(EmailDetails details);

    String sendMailWithAttachment(EmailDetails details);
}
