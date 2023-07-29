package top.flapypan.blog.entity

import jakarta.persistence.*

@Entity
@Table(name = "t_tag")
class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0L

    @Column(nullable = false, unique = true)
    var name: String = ""
}
