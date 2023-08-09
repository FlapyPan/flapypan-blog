package top.flapypan.blog.service

import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import top.flapypan.blog.common.RestException
import top.flapypan.blog.entity.Article
import top.flapypan.blog.repository.ArticleRepository
import top.flapypan.blog.repository.TagRepository
import top.flapypan.blog.vo.ArticleAddRequest
import top.flapypan.blog.vo.ArticleUpdateRequest

@Service
class ArticleService(
    private val repository: ArticleRepository,
    private val tagRepository: TagRepository
) {

    fun getPage(pageable: Pageable) = repository.findAll(pageable)

    fun getPageByCreateDate(): List<Article> =
        repository.findAll(Sort.by(Sort.Order.by("createDate").reverse()))

    fun searchByKeyword(keyword: String, pageable: Pageable) =
        repository.findAllByTitleContainingIgnoreCaseOrTagsNameContainingIgnoreCase(keyword, keyword, pageable)

    fun getByPath(path: String) =
        repository.findFirstByPath(path) ?: throw RestException(HttpStatus.NOT_FOUND.value(), "不存在的文章")

    @Transactional
    fun add(addRequest: ArticleAddRequest) =
        // 转换为实体
        addRequest.createEntity {
            // 获取 tag
            tags = tagRepository.findAllByNameIn(addRequest.tagNames)
        }.let {
            // 保存
            repository.save(it).path
        }

    private val pathRegex = Regex("^[a-z0-9:@._-]+$")

    @Transactional
    fun update(updateRequest: ArticleUpdateRequest): String {
        // 检查 path 有效性
        if (!pathRegex.matches(updateRequest.path)) {
            throw RestException(HttpStatus.BAD_REQUEST.value(), "path 格式无效")
        }
        // 查找文章
        val article = repository.findByIdOrNull(updateRequest.id)
            ?: throw RestException(HttpStatus.NOT_FOUND.value(), "不存在的文章")
        // 复制属性到实体
        updateRequest.copyToEntity(article) {
            // 获取 tag
            tags = tagRepository.findAllByNameIn(updateRequest.tagNames)
        }
        return repository.save(article).path
    }

    @Transactional
    fun delete(id: Long) = repository.deleteById(id)

}
