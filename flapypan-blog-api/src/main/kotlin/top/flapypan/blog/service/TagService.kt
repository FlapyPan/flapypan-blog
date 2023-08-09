package top.flapypan.blog.service

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import top.flapypan.blog.common.RestException
import top.flapypan.blog.entity.Tag
import top.flapypan.blog.repository.ArticleRepository
import top.flapypan.blog.repository.TagRepository
import top.flapypan.blog.vo.ArticleInfo
import top.flapypan.blog.vo.TagAddRequest
import top.flapypan.blog.vo.TagUpdateRequest

@Service
class TagService(
    private val repository: TagRepository,
    private val articleRepository: ArticleRepository
) {

    fun getAll(): List<Tag> = repository.findAll()

    fun findByName(name: String) =
        repository.findByName(name) ?: throw RestException(HttpStatus.NOT_FOUND.value(), "不存在的标签")

    @Transactional
    fun add(addRequest: TagAddRequest): String {
        val tag = addRequest.createEntity()
        if (repository.existsByNameIgnoreCase(addRequest.name)) {
            throw RestException(HttpStatus.BAD_REQUEST.value(), "标签已经存在")
        }
        return repository.save(tag).name
    }

    @Transactional
    fun update(updateRequest: TagUpdateRequest): String {
        val tag = repository.findByIdOrNull(updateRequest.id)
            ?: throw RestException(HttpStatus.NOT_FOUND.value(), "不存在的标签")
        updateRequest.copyToEntity(tag)
        return repository.save(tag).name
    }

    @Transactional
    fun delete(id: Long) {
        if (articleRepository.countByTagsId(id) > 0) {
            throw RestException(HttpStatus.BAD_REQUEST.value(), "当前标签下存在文章")
        }
        repository.deleteById(id)
    }

    fun getArticleByTag(tagName: String, pageable: Pageable): Page<ArticleInfo> {
        repository.findByName(tagName) ?: RestException(HttpStatus.NOT_FOUND.value(), "不存在的标签")
        return articleRepository
            .findAllByTagsName(tagName, pageable)
            .map(::ArticleInfo)
    }
}
