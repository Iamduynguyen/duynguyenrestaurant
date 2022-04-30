package com.restarant.backend.service.utils;

import com.restarant.backend.config.Settings;
import com.restarant.backend.model.ContentType;
import com.restarant.backend.model.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

public class UploadService {
    public static String upload(MultipartFile file) throws IOException {
        String uploadDir = Settings.UPLOAD_DIR;
        String fileName = UUID.randomUUID().toString();

        if (file.getContentType().equals(ContentType.JPG.getValue())) {
            fileName += MediaType.ImageType.JPG.getType();
        }
        if (file.getContentType().equals(ContentType.PNG.getValue())) {
            fileName += MediaType.ImageType.PNG.getType();
        }
        if (file.getContentType().contains(ContentType.MP4.getValue())) {
            fileName += MediaType.VideoType.MP4.getType();
        }
        Path root = Paths.get(uploadDir);
        Path resolve = root.resolve(fileName);
        Files.createDirectories(root);
        Files.copy(file.getInputStream(), resolve);

        return String.format("%s/%s/%s",
                Settings.WEB_PATH, Settings.UPLOAD_DIR, fileName);
    }
}
