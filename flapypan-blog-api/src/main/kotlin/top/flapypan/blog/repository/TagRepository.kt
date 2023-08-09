package top.flapypan.blog.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import top.flapypan.blog.entity.Tag

@Repository
interface TagRepository : JpaRepository<Tag, Long> {

    fun existsByNameIgnoreCase(name: String): Boolean

    fun findAllByNameIn(names: Collection<String>): List<Tag>

    fun findByName(name: String): Tag?

}
