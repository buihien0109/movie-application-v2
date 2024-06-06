package com.example.movieapp.service;

import com.example.movieapp.entity.Actor;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.request.UpsertActorRequest;
import com.example.movieapp.repository.ActorRepository;
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
public class ActorService {
    private final MovieRepository movieRepository;
    private final ActorRepository actorRepository;

    public List<Actor> getAllActors() {
        return actorRepository.findAll(Sort.by("createdAt").descending());
    }

    public Actor getActorById(Integer id) {
        return actorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy diễn viên có id = " + id));
    }

    public Actor saveActor(UpsertActorRequest request) {
        Actor actor = Actor.builder()
                .name(request.getName())
                .description(request.getDescription())
                .birthday(request.getBirthday())
                .avatar(StringUtils.generateLinkImage(request.getName()))
                .build();
        return actorRepository.save(actor);
    }

    public Actor updateActor(Integer id, UpsertActorRequest request) {
        Actor existingActor = actorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy diễn viên có id = " + id));

        existingActor.setName(request.getName());
        existingActor.setDescription(request.getDescription());
        existingActor.setBirthday(request.getBirthday());
        existingActor.setAvatar(request.getAvatar());
        return actorRepository.save(existingActor);
    }

    public void deleteActor(Integer id) {
        Actor existingActor = actorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy diễn viên có id = " + id));

        long count = movieRepository.countByActors_Id(id);
        if (count > 0) {
            throw new BadRequestException("Không thể xóa diễn viên này vì đang áp dụng cho phim");
        }

        actorRepository.deleteById(id);
    }
}
