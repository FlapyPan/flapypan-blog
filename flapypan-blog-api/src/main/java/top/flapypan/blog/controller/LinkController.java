package top.flapypan.blog.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import top.flapypan.blog.common.RestResult;
import top.flapypan.blog.entity.Link;
import top.flapypan.blog.service.LinkService;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/link")
public class LinkController {

    private final LinkService linkService;

    @SaIgnore
    @GetMapping
    public RestResult<List<Link>> getAll() {
        return RestResult.success(linkService.getAll());
    }

    @PostMapping
    public RestResult<List<Link>> save(@RequestBody List<Link> links) {
        return RestResult.success(linkService.save(links));
    }

}
