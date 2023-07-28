package top.flapypan.blog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "t_article", indexes = {
        @Index(columnList = "title", unique = true),
        @Index(columnList = "path", unique = true)
})
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String path;

    private String cover;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "t_article_tag",
            joinColumns = @JoinColumn(name = "article_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private LocalDateTime createDate;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private LocalDateTime updateDate;

}
