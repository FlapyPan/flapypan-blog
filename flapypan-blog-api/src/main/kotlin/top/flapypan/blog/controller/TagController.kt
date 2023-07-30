package top.flapypan.blog.controller

import cn.dev33.satoken.annotation.SaIgnore
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.Size
import org.springframework.data.domain.Pageable
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.restOk
import top.flapypan.blog.entity.Tag
import top.flapypan.blog.service.TagService

@RestController
@RequestMapping("/tag")
class TagController(
    private val tagService: TagService
) {

    @GetMapping
    @SaIgnore
    fun all() = tagService.getAll().restOk()

    @SaIgnore
    @Validated
    @GetMapping("/{name}")
    fun getByName(@PathVariable name: String) = tagService.findByName(name).restOk()

    @PostMapping
    fun add(@RequestBody @Validated addRequest: TagAddRequest) = tagService.add(addRequest).restOk()

    @PutMapping
    fun update(@RequestBody @Validated updateRequest: TagUpdateRequest) =
        tagService.update(updateRequest).restOk()

    @Validated
    @DeleteMapping("/{id}")
    fun delete(@PathVariable @Positive id: Long) = tagService.delete(id).restOk()

    @SaIgnore
    @GetMapping("/{tag}/article")
    fun getByCategory(@PathVariable tag: String, pageable: Pageable) =
        tagService.getArticleByTag(tag, pageable).restOk()
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

    @field:Positive(message = "无效的id")
    val id: Long,

    @field:Size(min = 2, max = 16, message = "标签名称应在2-16之间")
    val name: String

) {
    fun copyToEntity(entity: Tag) {
        if (name.isNotBlank()) {
            entity.name = name
        }
    }

}
