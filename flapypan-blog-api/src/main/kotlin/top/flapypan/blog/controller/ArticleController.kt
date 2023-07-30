package top.flapypan.blog.controller

import cn.dev33.satoken.annotation.SaIgnore
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.Size
import org.springframework.data.domain.Pageable
import org.springframework.util.StringUtils
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.restOk
import top.flapypan.blog.dto.ArticleSimpleDTO
import top.flapypan.blog.entity.Article
import top.flapypan.blog.service.ArticleService

@RestController
@RequestMapping("/article")
class ArticleController(
    private val articleService: ArticleService
) {

    @SaIgnore
    @GetMapping
    fun getPage(keyword: String?, pageable: Pageable) =
        (keyword?.takeIf(String::isNotBlank)?.let {
            articleService.searchByKeyword(it, pageable)
        } ?: articleService.getPage(pageable)).restOk()

    @GetMapping("/group-by/year")
    @SaIgnore
    fun getGroupByYear() = articleService.groupByYear().restOk()

    @SaIgnore
    @Validated
    @GetMapping("/{path}")
    fun getByPath(@PathVariable @Pattern(regexp = "^[a-z0-9:@._-]+$") path: String) =
        articleService.getByPath(path).restOk()

    @PostMapping
    fun add(@RequestBody @Validated articleAddRequest: ArticleAddRequest) =
        articleService.add(articleAddRequest).path.restOk()

    @PutMapping
    fun update(@RequestBody @Validated articleUpdateRequest: ArticleUpdateRequest) =
        articleService.update(articleUpdateRequest).path.restOk()

    @Validated
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: @Positive Long) = articleService.delete(id).restOk()
}

data class ArticleAddRequest(

    @field:Size(min = 2, max = 32, message = "标题长度应在2-32之间")
    val title: String,

    @field:Size(min = 3, max = 64, message = "路径长度应在3-64之间")
    @field:Pattern(regexp = "^[a-z0-9:@._-]+$", message = "路径只允许小写字母,数字,冒号,@,英文点,下划线,分隔符")
    val path: String,

    val cover: String = "",

    @field:NotBlank(message = "文章内容不能为空")
    val content: String,

    val tagNames: List<String> = mutableListOf()

) {

    fun createEntity() = Article().also {
        it.title = title
        // 没有指定路径则使用标题
        it.path = if (StringUtils.hasText(path)) path else title
        it.cover = cover
        it.content = content
    }

}

data class ArticleUpdateRequest(

    @field:Positive
    val id: Long,

    @field:Size(min = 2, max = 32, message = "标题长度应在2-32之间")
    val title: String,

    @field:Size(min = 3, max = 64, message = "路径长度应在3-64之间")
    @field:Pattern(
        regexp = "^[a-z0-9:@._-]+$",
        message = "路径只允许小写字母,数字,冒号,@,英文点,下划线,分隔符"
    )
    val path: String,

    val cover: String = "",

    @field:NotBlank(message = "文章内容不能为空")
    val content: String,

    val tagNames: List<String> = mutableListOf()

) {

    fun copyToEntity(entity: Article) {
        if (title.isNotBlank()) {
            entity.title = title
        }
        if (path.isNotBlank()) {
            entity.path = path
        }
        if (cover.isNotBlank()) {
            entity.cover = cover
        }
        if (content.isNotBlank()) {
            entity.content = content
        }
    }
}

data class ArticleGroupByYear(
    val year: String,
    val list: List<ArticleSimpleDTO>
) {
    constructor(year: Int, list: List<Article>) : this(year.toString(), list.map(::ArticleSimpleDTO))
}
