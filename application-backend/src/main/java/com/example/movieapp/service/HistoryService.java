package com.example.movieapp.service;

import com.example.movieapp.entity.Episode;
import com.example.movieapp.entity.History;
import com.example.movieapp.entity.Movie;
import com.example.movieapp.entity.User;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.dto.HistoryDto;
import com.example.movieapp.model.request.CreateHistoryRequest;
import com.example.movieapp.repository.EpisodeRepository;
import com.example.movieapp.repository.MovieRepository;
import com.example.movieapp.repository.HistoryRepository;
import com.example.movieapp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HistoryService {
    private final HistoryRepository historyRepository;
    private final MovieRepository movieRepository;
    private final EpisodeRepository episodeRepository;

    public void addHistoryMovie(CreateHistoryRequest request) {
        log.info("Saving watch movie: {}", request);
        // Lấy thông tin user từ context
        User user = SecurityUtils.getCurrentUserLogin();

        // Kiểm tra xem phim có tồn tại không? Nếu không tồn tại thì throw exception
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim với id: " + request.getMovieId()));

        // Kiểm tra xem tập phim có tồn tại không? Nếu không tồn tại thì throw exception
        Episode episode = episodeRepository.findById(request.getEpisodeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tập phim với id: " + request.getEpisodeId()));

        // Kiểm tra xem thời lượng xem có hợp lệ không? Nếu không hợp lệ thì throw exception
        if (request.getDuration() < 0 || request.getDuration() > episode.getVideo().getDuration()) {
            throw new BadRequestException("Thời lượng xem không hợp lệ");
        }

        // Kiểm tra xem người dùng đã xem phim này chưa? Nếu đã xem rồi cập nhật lại thời lượng xem
        History history = historyRepository.findByUser_IdAndMovie_Id(
                user.getId(),
                movie.getId()
        ).orElse(null);

        if (history == null) {
            // Nếu chưa xem thì tạo mới lịch sử xem phim
            history = History.builder()
                    .user(user)
                    .movie(movie)
                    .episode(episode)
                    .duration(request.getDuration())
                    .build();
        } else {
            // Nếu trùng episode thì cập nhật lại thời lượng xem
            if (history.getEpisode().getId().equals(episode.getId())) {
                history.setDuration(request.getDuration());
            } else {
                // Nếu không trùng episode thì cập nhật lại episode và thời lượng xem
                history.setEpisode(episode);
                history.setDuration(request.getDuration());
            }
        }

        // Lưu lịch sử xem phim
        historyRepository.save(history);
    }

    public List<HistoryDto> getHistoryMoviesByCurrentUser() {
        log.info("Getting watch histories of current user");
        User user = SecurityUtils.getCurrentUserLogin();

        return historyRepository.findByUser_Id(
                user.getId(),
                Sort.by(Sort.Direction.DESC, "watchTime"));
    }

    public void deleteHistoryMovie(Integer id) {
        // Lấy thông tin user từ context
        User user = SecurityUtils.getCurrentUserLogin();

        // Kiểm tra lịch sử có tồn tại không? Nếu không tồn tại thì throw exception
        History history = historyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch sử xem phim với id: " + id));

        // Kiểm tra xem lịch sử xem phim này có phải của user hiện tại không? Nếu không phải thì throw exception
        if (!history.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Bạn không có quyền xóa lịch sử xem phim này");
        }

        // Xóa lịch sử xem phim
        historyRepository.delete(history);
    }

    @Transactional
    public void deleteAllHistoryMovie() {
        // Lấy thông tin user từ context
        User user = SecurityUtils.getCurrentUserLogin();

        // Xóa tất cả lịch sử xem phim của user hiện tại
        historyRepository.deleteAllByUser_Id(user.getId());
    }

    public HistoryDto getHistoryMovie(Integer movieId, Integer episodeId) {
        // Lấy thông tin user từ context
        User user = SecurityUtils.getCurrentUserLogin();

        if (user == null) {
            return null;
        }

        return historyRepository.findByUser_IdAndMovie_IdAndEpisode_Id(user.getId(), movieId, episodeId)
                .orElse(null);
    }
}
