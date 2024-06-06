package com.example.movieapp.service;

import com.example.movieapp.entity.Country;
import com.example.movieapp.exception.BadRequestException;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.dto.MovieDto;
import com.example.movieapp.model.enums.MovieAccessType;
import com.example.movieapp.model.request.UpsertCountryRequest;
import com.example.movieapp.repository.CountryRepository;
import com.example.movieapp.repository.MovieRepository;
import com.github.slugify.Slugify;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class CountryService {
    private final CountryRepository countryRepository;
    private final MovieRepository movieRepository;
    private final Slugify slugify;

    public List<Country> getAllCountries() {
        return countryRepository.findAll(Sort.by("id").descending());
    }

    public Page<MovieDto> getMoviesByCountry(String slug, Integer page, Integer limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("publishedAt").descending());
        return movieRepository.findByAccessTypeAndStatusAndCountry_SlugOrderByPublishedAtDesc(MovieAccessType.FREE, true, slug, pageable);
    }

    public Country getCountryBySlug(String slug) {
        return countryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quốc gia có slug = " + slug));
    }

    public Country getCountryById(Integer id) {
        return countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quốc gia có id = " + id));
    }

    public Country saveCountry(UpsertCountryRequest request) {
        if (countryRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Quốc gia đã tồn tại");
        }

        Country country = Country.builder()
                .name(request.getName())
                .slug(slugify.slugify(request.getName()))
                .build();

        return countryRepository.save(country);
    }

    public Country updateCountry(Integer id, UpsertCountryRequest request) {
        Country existingCountry = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Quốc gia có id = " + id));

        if (countryRepository.findByName(request.getName()).isPresent() && !Objects.equals(existingCountry.getName(), request.getName())) {
            throw new BadRequestException("Quốc gia đã tồn tại");
        }

        existingCountry.setName(request.getName());
        existingCountry.setSlug(slugify.slugify(request.getName()));
        return countryRepository.save(existingCountry);
    }

    public void deleteCountry(Integer id) {
        Country existingCountry = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy Quốc gia có id = " + id));

        long count = movieRepository.countByCountry_Id(existingCountry.getId());
        if (count > 0) {
            throw new BadRequestException("Không thể xóa quốc gia này vì có " + count + " phim thuộc quốc gia này");
        }

        countryRepository.deleteById(id);
    }
}
