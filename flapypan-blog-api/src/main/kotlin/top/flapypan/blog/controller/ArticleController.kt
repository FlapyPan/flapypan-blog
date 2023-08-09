package top.flapypan.blog.controller

import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Positive
import org.springframework.data.domain.Pageable
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.restOk
import top.flapypan.blog.service.ArticleService
import top.flapypan.blog.vo.ArticleAddRequest
import top.flapypan.blog.vo.ArticleUpdateRequest
import top.flapypan.blog.vo.groupByYear

@RestController
@RequestMapping("/article")
class ArticleController(
    private val articleService: ArticleService
) {

    @GetMapping
    fun getPage(keyword: String?, pageable: Pageable) =
        (keyword?.takeIf(String::isNotBlank)?.let {
            articleService.searchByKeyword(it, pageable)
        } ?: articleService.getPage(pageable)).restOk()

    @GetMapping("/group-by/year")
    fun getGroupByYear() =
        articleService.getPageByCreateDate().groupByYear().restOk()


    @Validated
    @GetMapping("/{path}")
    fun getByPath(@PathVariable @Pattern(regexp = "^[a-z0-9:@._-]+$") path: String) =
        articleService.getByPath(path).restOk()

    @PostMapping
    fun add(@RequestBody @Validated articleAddRequest: ArticleAddRequest) =
        articleService.add(articleAddRequest).restOk()

    @PutMapping
    fun update(@RequestBody @Validated articleUpdateRequest: ArticleUpdateRequest) =
        articleService.update(articleUpdateRequest).restOk()

    @Validated
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: @Positive Long) =
        articleService.delete(id).restOk()
}
