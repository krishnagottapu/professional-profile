package com.gottapu.portfolio.repository;

import com.gottapu.portfolio.entity.BlogPost;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlug(String slug);

    Page<BlogPost> findByPublishedTrueOrderByCreatedAtDesc(Pageable pageable);
}
