package top.flapypan.blog.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime

@Entity
@Table(
    name = "t_article",
    indexes = [
        Index(columnList = "title", unique = true),
        Index(columnList = "path", unique = true)
    ]
)
class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0L

    @Column(nullable = false)
    var title: String = ""

    @Column(nullable = false)
    var path: String = ""

    var cover: String? = null

    @Column(columnDefinition = "TEXT", nullable = false)
    var content: String = ""

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "t_article_tag",
        joinColumns = [JoinColumn(name = "article_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    var tags: List<Tag> = mutableListOf()

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    var createDate: LocalDateTime = LocalDateTime.now()

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    var updateDate: LocalDateTime = LocalDateTime.now()
}
