package top.flapypan.blog.service

import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import top.flapypan.blog.common.RestException
import top.flapypan.blog.controller.ArticleGroupByYear
import top.flapypan.blog.controller.ArticleUpdateRequest
import top.flapypan.blog.dto.ArticleDTO
import top.flapypan.blog.dto.ArticleSimpleDTO
import top.flapypan.blog.repository.ArticleRepository
import top.flapypan.blog.repository.TagRepository

@Service
class ArticleService(
    private val repository: ArticleRepository,
    private val tagRepository: TagRepository
) {

    fun getPage(pageable: Pageable) =
        repository.findAll(pageable)
            .map(::ArticleSimpleDTO)

    fun searchByKeyword(keyword: String, pageable: Pageable) =
        repository.findByKeyword("%${keyword.lowercase()}%", pageable)
            .map(::ArticleSimpleDTO)

    fun groupByYear(): List<ArticleGroupByYear> =
        repository.findAll(Sort.by(Sort.Order.by("createDate").reverse()))
            .groupBy { it.createDate.year }
            .map { (year, articles) -> ArticleGroupByYear(year, articles) }

    fun getByPath(path: String): ArticleDTO {
        val article = repository.findFirstByPath(path)
            ?: throw RestException(HttpStatus.NOT_FOUND.value(), "不存在的文章")
        return ArticleDTO(article)
    }


    @Transactional
    fun add(addRequest: top.flapypan.blog.controller.ArticleAddRequest) =
        // 转换为实体
        addRequest.createEntity().let {
            if (addRequest.tagNames.isNotEmpty()) {
                // 获取 tag
                it.tags = tagRepository.findAllByNameIn(addRequest.tagNames)
            }
            // 保存返回
            ArticleDTO(repository.save(it))
        }

    private val pathRegex = Regex("^[a-z0-9:@._-]+$")

    @Transactional
    fun update(updateRequest: ArticleUpdateRequest): ArticleDTO {
        // 检查 path 有效性
        if (!pathRegex.matches(updateRequest.path)) {
            throw RestException(HttpStatus.BAD_REQUEST.value(), "path 格式无效")
        }
        // 查找文章
        val article = repository.findByIdOrNull(updateRequest.id)
            ?: throw RestException(HttpStatus.NOT_FOUND.value(), "不存在的文章")
        // 复制属性到实体
        updateRequest.copyToEntity(article)
        // 获取 tag
        if (updateRequest.tagNames.isNotEmpty()) {
            article.tags = tagRepository.findAllByNameIn(updateRequest.tagNames)
        }
        return ArticleDTO(repository.save(article))
    }

    @Transactional
    fun delete(id: Long) = repository.deleteById(id)

}
