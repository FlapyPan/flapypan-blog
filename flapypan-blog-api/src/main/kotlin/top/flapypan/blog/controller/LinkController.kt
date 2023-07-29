package top.flapypan.blog.controller

import cn.dev33.satoken.annotation.SaIgnore
import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.success
import top.flapypan.blog.entity.Link
import top.flapypan.blog.service.LinkService

@RestController
@RequestMapping("/link")
class LinkController(
    private val linkService: LinkService
) {

    @GetMapping
    @SaIgnore
    fun all() = success(linkService.getAll())

    @PostMapping
    fun save(@RequestBody links: List<Link>) = success(linkService.save(links))
}
