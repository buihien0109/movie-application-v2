package com.example.movieapp.service;

import com.example.movieapp.constant.ConstantValue;
import com.example.movieapp.entity.Image;
import com.example.movieapp.entity.User;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.response.ImageResponse;
import com.example.movieapp.repository.ImageRepository;
import com.example.movieapp.security.SecurityUtils;
import com.example.movieapp.utils.FileUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ImageService {
    private final String uploadDir = "image_uploads";
    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
        createDirectory(uploadDir);
    }


    public void createDirectory(String name) {
        Path path = Paths.get(name);
        if (!Files.exists(path)) {
            try {
                Files.createDirectory(path);
            } catch (IOException e) {
                log.error("Cannot create directory: " + path);
                log.error(e.getMessage());
                throw new RuntimeException("Cannot create directory: " + path);
            }
        }
    }

    public List<ImageResponse> getAllImage() {
        User user = SecurityUtils.getCurrentUserLogin();
        List<Image> images = imageRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());

        return images.stream()
                .map(image -> new ImageResponse(image.getId(), "/api/public/images/" + image.getId()))
                .toList();
    }

    public Image getImageById(String id) {
        return imageRepository.findById(id).orElse(null);
    }

    public ImageResponse uploadImage(MultipartFile file) {
        User user = SecurityUtils.getCurrentUserLogin();
        validateFile(file);

        String imageId = UUID.randomUUID().toString();
        Path rootPath = Paths.get(uploadDir);
        Path filePath = rootPath.resolve(imageId);

        try {
            Files.copy(file.getInputStream(), filePath);

            Image image = Image.builder()
                    .id(imageId)
                    .type(file.getContentType())
                    .size(extractSize(file))
                    .user(user)
                    .build();

            imageRepository.save(image);

            String url = "/api/public/images/" + image.getId();
            return ImageResponse.builder()
                    .id(imageId)
                    .url(url)
                    .build();
        } catch (IOException e) {
            log.error("Cannot upload file: " + filePath);
            log.error(e.getMessage());
            throw new RuntimeException("Cannot upload file: " + filePath);
        }
    }

    public ImageResponse uploadImage(byte[] data) {
        String imageId = UUID.randomUUID().toString();
        Path rootPath = Paths.get(uploadDir);
        Path filePath = rootPath.resolve(imageId);

        try {
            Files.write(filePath, data);

            // Tính toán kích thước file theo MB
            double sizeInMB = BigDecimal.valueOf(data.length / 1024.0 / 1024.0)
                    .setScale(2, RoundingMode.HALF_UP)
                    .doubleValue();
            Image image = Image.builder()
                    .id(imageId)
                    .type("image/png")
                    .size(sizeInMB)
                    .build();

            imageRepository.save(image);

            String url = "/api/public/images/" + image.getId();
            return ImageResponse.builder()
                    .id(imageId)
                    .url(url)
                    .build();
        } catch (IOException e) {
            log.error("Cannot upload file: " + filePath);
            log.error(e.getMessage());
            throw new RuntimeException("Cannot upload file: " + filePath);
        }
    }

    private void validateFile(MultipartFile file) {
        // Kiểm tra tên file
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new BadRequestException("File name không được để trống");
        }

        String fileExtension = getFileExtensiton(fileName);
        if (!checkFileExtension(fileExtension)) {
            throw new BadRequestException("File không đúng định dạng");
        }

        // Kiểm tra dung lượng file (<= 2MB)
        if (extractSize(file) > 2.0) {
            throw new BadRequestException("File không được vượt quá 2MB");
        }
    }

    private String getFileExtensiton(String fileName) {
        int lastIndexOf = fileName.lastIndexOf(".");
        return fileName.substring(lastIndexOf + 1);
    }

    private boolean checkFileExtension(String fileExtension) {
        List<String> extensions = new ArrayList<>(List.of("png", "jpg", "jpeg"));
        return extensions.contains(fileExtension.toLowerCase());
    }

    // Tính toán kích thước của file
    public double extractSize(MultipartFile file) {
        long sizeInBytes = file.getSize();

        // làm tròn 2 dấu phay động
        return Math.round((double) sizeInBytes / (1024 * 1024) * 100) / 100.0;
    }

    @Transactional
    public void deleteImage(String id) {
        User user = SecurityUtils.getCurrentUserLogin();

        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy image có id = " + id));

        if (!image.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Bạn không có quyền xóa image này");
        }

        // Xóa file trong database
        imageRepository.delete(image);

        // Xóa file trong thư mục
        FileUtils.deleteFile(ConstantValue.UPLOAD_IMAGE_DIR, id);
    }

    public byte[] getImageData(Image image) {
        Path rootPath = Paths.get(uploadDir);
        Path filePath = rootPath.resolve(image.getId());

        try {
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.error("Cannot read file: {}", filePath);
            log.error(e.getMessage());
            throw new RuntimeException("Cannot read file: " + filePath);
        }
    }

    public Resource loadImageAsResource(String id) {
        try {
            Path rootPath = Paths.get(uploadDir);
            Path filePath = rootPath.resolve(id);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("The file " + id + " doesn't exist or not readable");
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not read the file: " + id, e);
        }
    }
}
