package com.ecomerce.roblnk.service.Impl;

import com.cloudinary.Cloudinary;
import com.ecomerce.roblnk.service.CloudinaryService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ICloudinaryService implements CloudinaryService {
    private final Cloudinary cloudinary;
    @Override
    public Map<?, ?> uploadFile(MultipartFile file, String folderName) {
        try{
            HashMap<Object, Object> options = new HashMap<>();
            options.put("folder", folderName);
            Map<?,?> uploadedFile = cloudinary.uploader().upload(file.getBytes(), options);
            String publicId = (String) uploadedFile.get("public_id");
            String resourceType = (String) uploadedFile.get("resource_type");
            return uploadedFile;

        }catch (IOException | java.io.IOException e){
            e.printStackTrace();
            return null;
        }
    }
}
