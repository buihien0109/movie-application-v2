package com.example.movieapp.utils;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
public class FileUtils {
    public static void createDirectory(String name) {
        Path path = Paths.get(name);
        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                log.error("Không thể tạo thư mục upload");
                log.error(e.getMessage());
                throw new RuntimeException("Could not create upload folder");
            }
        }
    }

    public static void deleteFile(String uploadDir, String fileName) {
        log.info("Xóa file: {}", fileName);
        Path rootPath = Paths.get(uploadDir);
        Path filePath = rootPath.resolve(fileName);

        if (!Files.exists(filePath)) {
            log.error("Không tìm thấy file: {}", fileName);
        } else {
            try {
                Files.delete(filePath);
            } catch (IOException e) {
                log.error("Không thể xóa file: {}", fileName);
                log.error(e.getMessage());
                throw new RuntimeException("Could not delete file: " + fileName);
            }
        }
    }

    // URL: /api/public/images/{id}. id is the name of the file in the image_uploads directory.
    public static void deleteFileByURL(String uploadDir, String url) {
        if (url == null || !url.startsWith("/api")) {
            return;
        }
        String id = url.substring(url.lastIndexOf("/") + 1);
        deleteFile(uploadDir, id);
    }
}
