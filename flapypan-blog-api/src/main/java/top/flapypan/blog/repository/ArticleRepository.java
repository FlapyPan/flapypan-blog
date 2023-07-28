package top.flapypan.blog.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import top.flapypan.blog.entity.Article;

import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    Optional<Article> findFirstByPath(String path);

    @Query("""
            SELECT a FROM Article a
                WHERE LOWER(a.title) LIKE :keyword
                OR EXISTS (SELECT t FROM a.tags t WHERE LOWER(t.name) LIKE :keyword)
            """)
    Page<Article> findByKeyword(String keyword, Pageable pageable);

    @Query("""
            SELECT a FROM Article a
                JOIN a.tags t
                WHERE t.name = :tagName
            """)
    Page<Article> findAllByTagsName(String tagName, Pageable pageable);

}
