package top.flapypan.blog.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import top.flapypan.blog.common.RestResult;
import top.flapypan.blog.dto.ArticleSimpleDTO;
import top.flapypan.blog.dto.TagDTO;
import top.flapypan.blog.entity.Tag;
import top.flapypan.blog.service.TagService;
import top.flapypan.blog.vo.TagAddRequest;
import top.flapypan.blog.vo.TagUpdateRequest;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/tag")
public class TagController {

    private final TagService tagService;

    @SaIgnore
    @GetMapping
    public RestResult<List<TagDTO>> getAll() {
        return RestResult.success(tagService.getAll());
    }

    @SaIgnore
    @Validated
    @GetMapping("/{name}")
    public RestResult<Tag> getByName(@PathVariable @NotBlank String name) {
        Tag tag = tagService.findByName(name);
        return RestResult.success(tag);
    }

    @PostMapping
    public RestResult<Tag> add(@RequestBody @Validated TagAddRequest addRequest) {
        Tag tag = tagService.add(addRequest);
        return RestResult.success(tag);
    }

    @PutMapping
    public RestResult<Tag> update(@RequestBody @Validated TagUpdateRequest updateRequest) {
        return RestResult.success(tagService.update(updateRequest));
    }

    @Validated
    @DeleteMapping("/{id}")
    public RestResult<Void> delete(@PathVariable @Positive Long id) {
        tagService.delete(id);
        return RestResult.success();
    }

    @SaIgnore
    @GetMapping("/{tag}/article")
    public RestResult<Page<ArticleSimpleDTO>> getByCategory(@PathVariable String tag, Pageable pageable) {
        return RestResult.success(tagService.getArticleByTag(tag, pageable));
    }

}
