package top.flapypan.blog.controller

import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.checkLogin
import top.flapypan.blog.common.restOk
import top.flapypan.blog.entity.Link
import top.flapypan.blog.service.LinkService

@RestController
@RequestMapping("/link")
class LinkController(
    private val linkService: LinkService
) {

    @GetMapping
    fun all() = linkService.getAll().restOk()

    @PostMapping
    fun save(@RequestBody links: List<Link>) =
        checkLogin { linkService.save(links).restOk() }
}
