package top.flapypan.blog.service

import org.springframework.data.domain.Example
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import top.flapypan.blog.common.RestException
import top.flapypan.blog.controller.TagAddRequest
import top.flapypan.blog.controller.TagUpdateRequest
import top.flapypan.blog.dto.ArticleSimpleDTO
import top.flapypan.blog.entity.Tag
import top.flapypan.blog.repository.ArticleRepository
import top.flapypan.blog.repository.TagRepository

@Service
class TagService(
    private val repository: TagRepository,
    private val articleRepository: ArticleRepository
) {

    fun getAll() = repository.getTagDTOList()

    fun findByName(name: String) =
        repository.findByName(name) ?: throw RestException(HttpStatus.NOT_FOUND.value(), "不存在的标签")

    @Transactional
    fun add(addRequest: TagAddRequest): Tag {
        val tag = addRequest.createEntity()
        if (repository.exists(Example.of(tag))) {
            throw RestException(HttpStatus.BAD_REQUEST.value(), "标签已经存在")
        }
        return repository.save(tag)
    }

    @Transactional
    fun update(updateRequest: TagUpdateRequest): Tag {
        val tag = repository.findByIdOrNull(updateRequest.id)
            ?: throw RestException(HttpStatus.NOT_FOUND.value(), "不存在的标签")
        updateRequest.copyToEntity(tag)
        return repository.save(tag)
    }

    @Transactional
    fun delete(id: Long) {
        repository.deleteArticleTagByTagId(id)
        repository.deleteById(id)
    }

    fun getArticleByTag(tagName: String, pageable: Pageable): Page<ArticleSimpleDTO> {
        repository.findByName(tagName) ?: RestException(HttpStatus.NOT_FOUND.value(), "不存在的标签")
        return articleRepository
            .findAllByTagsName(tagName, pageable)
            .map(::ArticleSimpleDTO)
    }
}
