package top.flapypan.blog.controller

import cn.dev33.satoken.annotation.SaIgnore
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.Size
import org.springframework.data.domain.Pageable
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.success
import top.flapypan.blog.entity.Tag
import top.flapypan.blog.service.TagService

@RestController
@RequestMapping("/tag")
class TagController(
    private val tagService: TagService
) {

    @GetMapping
    @SaIgnore
    fun all() = success(tagService.getAll())

    @SaIgnore
    @Validated
    @GetMapping("/{name}")
    fun getByName(@PathVariable name: String) =
        success(tagService.findByName(name))

    @PostMapping
    fun add(@RequestBody @Validated addRequest: TagAddRequest) =
        success(tagService.add(addRequest))

    @PutMapping
    fun update(@RequestBody @Validated updateRequest: TagUpdateRequest) =
        success(tagService.update(updateRequest))

    @Validated
    @DeleteMapping("/{id}")
    fun delete(@PathVariable @Positive id: Long) =
        tagService.delete(id).run { success() }

    @SaIgnore
    @GetMapping("/{tag}/article")
    fun getByCategory(@PathVariable tag: String, pageable: Pageable) =
        success(tagService.getArticleByTag(tag, pageable))
}

data class TagAddRequest(
    @Size(min = 2, max = 16, message = "标签名称应在2-16之间")
    val name: String
) {
    fun createEntity() = Tag().also {
        it.name = name
    }

}

data class TagUpdateRequest(

    @Positive(message = "无效的id")
    val id: Long,

    @Size(min = 2, max = 16, message = "标签名称应在2-16之间")
    val name: String

) {
    fun copyToEntity(entity: Tag) {
        if (name.isNotBlank()) {
            entity.name = name
        }
    }

}
