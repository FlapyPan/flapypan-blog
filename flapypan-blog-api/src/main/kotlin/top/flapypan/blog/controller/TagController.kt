package top.flapypan.blog.controller

import jakarta.validation.constraints.Positive
import org.springframework.data.domain.Pageable
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.restOk
import top.flapypan.blog.service.TagService
import top.flapypan.blog.vo.TagAddRequest
import top.flapypan.blog.vo.TagUpdateRequest

@RestController
@RequestMapping("/tag")
class TagController(
    private val tagService: TagService
) {

    @GetMapping
    fun all() = tagService.getAll().restOk()

    @Validated
    @GetMapping("/{name}")
    fun getByName(@PathVariable name: String) = tagService.findByName(name).restOk()

    @PostMapping
    fun add(@RequestBody @Validated addRequest: TagAddRequest) = tagService.add(addRequest).restOk()

    @PutMapping
    fun update(@RequestBody @Validated updateRequest: TagUpdateRequest) = tagService.update(updateRequest).restOk()

    @Validated
    @DeleteMapping("/{id}")
    fun delete(@PathVariable @Positive id: Long) = tagService.delete(id).restOk()

    @GetMapping("/{tag}/article")
    fun listArticle(@PathVariable tag: String, pageable: Pageable) =
        tagService.getArticleByTag(tag, pageable).restOk()
}
