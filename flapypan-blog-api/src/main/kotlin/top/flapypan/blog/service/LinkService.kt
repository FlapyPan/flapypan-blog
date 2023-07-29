package top.flapypan.blog.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import top.flapypan.blog.entity.Link
import top.flapypan.blog.repository.LinkRepository

@Service
class LinkService(
    private val repository: LinkRepository
) {

    fun getAll(): List<Link> = repository.findAll()

    @Transactional
    fun save(links: List<Link>): List<Link> {
        repository.deleteAll()
        return repository.saveAll(links)
    }
}
