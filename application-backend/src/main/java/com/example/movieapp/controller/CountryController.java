package com.example.movieapp.controller;

import com.example.movieapp.model.request.UpsertCountryRequest;
import com.example.movieapp.service.CountryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api")
@RequiredArgsConstructor
public class CountryController {
    private final CountryService countryService;

    @GetMapping("/public/countries")
    public ResponseEntity<?> getAllCountries() {
        return ResponseEntity.ok(countryService.getAllCountries());
    }

    @GetMapping("/public/countries/{slug}")
    public ResponseEntity<?> getCountryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(countryService.getCountryBySlug(slug));
    }

    @GetMapping("/public/countries/{slug}/movies")
    public ResponseEntity<?> getMoviesByCountry(@PathVariable String slug,
                                                @RequestParam(required = false, defaultValue = "1") Integer page,
                                                @RequestParam(required = false, defaultValue = "18") Integer limit) {
        return ResponseEntity.ok(countryService.getMoviesByCountry(slug, page, limit));
    }

    @GetMapping("/admin/countries")
    public ResponseEntity<?> getAllCountriesByAdmin() {
        return ResponseEntity.ok(countryService.getAllCountries());
    }

    @GetMapping("/admin/countries/{id}")
    public ResponseEntity<?> getCountryById(@PathVariable Integer id) {
        return ResponseEntity.ok(countryService.getCountryById(id));
    }

    @PostMapping("/admin/countries")
    public ResponseEntity<?> createCountry(@Valid @RequestBody UpsertCountryRequest request) {
        return new ResponseEntity<>(countryService.saveCountry(request), HttpStatus.CREATED);
    }

    @PutMapping("/admin/countries/{id}")
    public ResponseEntity<?> updateCountry(@PathVariable Integer id, @Valid @RequestBody UpsertCountryRequest request) {
        return ResponseEntity.ok(countryService.updateCountry(id, request));
    }

    @DeleteMapping("/admin/countries/{id}")
    public ResponseEntity<?> deleteCountry(@PathVariable Integer id) {
        countryService.deleteCountry(id);
        return ResponseEntity.noContent().build();
    }
}
