package com.ecomerce.roblnk.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface CloudinaryService {
    Map<?, ?> uploadFile(MultipartFile file, String folderName);

}
