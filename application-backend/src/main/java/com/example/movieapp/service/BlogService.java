package com.example.movieapp.service;

import com.example.movieapp.entity.Blog;
import com.example.movieapp.entity.User;
import com.example.movieapp.entity.ViewHistory;
import com.example.movieapp.exception.ResourceNotFoundException;
import com.example.movieapp.model.dto.BlogDetailDto;
import com.example.movieapp.model.dto.BlogDto;
import com.example.movieapp.model.request.UpsertBlogRequest;
import com.example.movieapp.repository.BlogRepository;
import com.example.movieapp.security.SecurityUtils;
import com.example.movieapp.utils.StringUtils;
import com.github.slugify.Slugify;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    private final Slugify slugify;

    public Page<BlogDto> getAllBlogs(Integer page, Integer limit) {
        return blogRepository.findByStatus(true, PageRequest.of(page - 1, limit, Sort.by("publishedAt").descending()));
    }

    public Page<BlogDto> getNewestBlogs(int page, int size, Integer blogId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        return blogRepository.findByIdNotAndStatus(blogId, true, pageable);
    }

    public BlogDetailDto getBlogDetails(Integer id, String slug) {
        Blog blog = blogRepository.findByIdAndSlugAndStatus(id, slug, true)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog có id = " + id));

        // Save view history
        int viewCount = blog.getViewCount() == null ? 0 : blog.getViewCount();
        blog.setViewCount(viewCount + 1);
        ViewHistory viewHistory = ViewHistory.builder()
                .blog(blog)
                .build();
        blog.addViewHistory(viewHistory);
        blogRepository.save(blog);

        return blogRepository.findBlogDetails(id, slug, true)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog có id = " + id));
    }

    public List<Blog> getAllBlog() {
        return blogRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Transactional
    public Blog createBlog(UpsertBlogRequest request) {
        User user = SecurityUtils.getCurrentUserLogin();

        Blog blog = Blog.builder()
                .title(request.getTitle())
                .slug(slugify.slugify(request.getTitle()))
                .content(request.getContent())
                .description(request.getDescription())
                .thumbnail(StringUtils.generateLinkImage(request.getTitle()))
                .status(request.getStatus())
                .user(user)
                .build();
        return blogRepository.save(blog);
    }

    public Blog getBlogById(Integer id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog có id = " + id));
    }

    @Transactional
    public Blog updateBlog(Integer id, UpsertBlogRequest request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog có id = " + id));

        blog.setTitle(request.getTitle());
        blog.setSlug(slugify.slugify(request.getTitle()));
        blog.setDescription(request.getDescription());
        blog.setContent(request.getContent());
        blog.setStatus(request.getStatus());
        blog.setThumbnail(request.getThumbnail());
        return blogRepository.save(blog);
    }

    @Transactional
    public void deleteBlog(Integer id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog có id = " + id));
        blogRepository.delete(blog);
    }

    public List<Blog> getOwnBlogs() {
        User user = SecurityUtils.getCurrentUserLogin();
        return blogRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
    }
}
