package com.example.movieapp;

import com.example.movieapp.utils.crawl.MovieCrawler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class MovieCrawlerTests {
    @Autowired
    private MovieCrawler movieCrawler;

    @Test
    void test_crawlMovie() {
        movieCrawler.crawlMovie("https://momo.vn/cinema/antman-and-the-wasp-quantumania-851");
    }

    @Test
    void test_crawlAllMovie() {
        movieCrawler.crawlAllMovie();
    }
}
