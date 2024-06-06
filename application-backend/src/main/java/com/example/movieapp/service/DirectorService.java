package com.example.movieapp.service;

import com.example.movieapp.entity.Director;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.request.UpsertDirectorRequest;
import com.example.movieapp.repository.DirectorRepository;
import com.example.movieapp.repository.MovieRepository;
import com.example.movieapp.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DirectorService {
    private final MovieRepository movieRepository;
    private final DirectorRepository directorRepository;

    public List<Director> getAllDirectors() {
        return directorRepository.findAll(Sort.by("createdAt").descending());
    }

    public Director getDirectorById(Integer id) {
        return directorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đạo diễn có id = " + id));
    }

    public Director saveDirector(UpsertDirectorRequest request) {
        Director director = Director.builder()
                .name(request.getName())
                .description(request.getDescription())
                .birthday(request.getBirthday())
                .avatar(StringUtils.generateLinkImage(request.getName()))
                .build();
        return directorRepository.save(director);
    }

    public Director updateDirector(Integer id, UpsertDirectorRequest request) {
        Director existingDirector = directorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đạo diễn có id = " + id));

        existingDirector.setName(request.getName());
        existingDirector.setDescription(request.getDescription());
        existingDirector.setBirthday(request.getBirthday());
        existingDirector.setAvatar(request.getAvatar());
        return directorRepository.save(existingDirector);
    }

    public void deleteDirector(Integer id) {
        Director existingDirector = directorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đạo diễn có id = " + id));

        long count = movieRepository.countByDirectors_Id(id);
        if (count > 0) {
            throw new BadRequestException("Không thể xóa đạo diễn này vì đang áp dụng cho phim");
        }

        directorRepository.deleteById(id);
    }
}
