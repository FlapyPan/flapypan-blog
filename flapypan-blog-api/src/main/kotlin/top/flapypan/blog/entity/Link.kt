package top.flapypan.blog.entity

import jakarta.persistence.*

@Entity
@Table(name = "t_link")
class Link {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0L

    @Column(nullable = false)
    var name: String = ""

    @Column(nullable = false)
    var url: String = ""
}
