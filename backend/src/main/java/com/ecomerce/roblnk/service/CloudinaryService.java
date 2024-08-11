package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.util.ByteMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface CloudinaryService {
    Map<?, ?> uploadFile(MultipartFile file, String folderName);

}
