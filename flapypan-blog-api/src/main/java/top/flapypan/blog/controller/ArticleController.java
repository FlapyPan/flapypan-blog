package top.flapypan.blog.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import top.flapypan.blog.common.RestResult;
import top.flapypan.blog.dto.ArticleDTO;
import top.flapypan.blog.dto.ArticleSimpleDTO;
import top.flapypan.blog.service.ArticleService;
import top.flapypan.blog.vo.ArticleAddRequest;
import top.flapypan.blog.vo.ArticleGroupByYear;
import top.flapypan.blog.vo.ArticleUpdateRequest;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/article")
public class ArticleController {

    private final ArticleService articleService;

    @SaIgnore
    @GetMapping
    public RestResult<Page<ArticleSimpleDTO>> getPage(String keyword, Pageable pageable) {
        Page<ArticleSimpleDTO> page;
        if (StringUtils.hasText(keyword)) {
            page = articleService.searchByKeyword(keyword, pageable);
        } else {
            page = articleService.getPage(pageable);
        }
        return RestResult.success(page);
    }

    @SaIgnore
    @GetMapping("/group-by/year")
    public RestResult<List<ArticleGroupByYear>> getGroupByYear() {
        return RestResult.success(articleService.getGroupByYear());
    }

    @SaIgnore
    @Validated
    @GetMapping("/{path}")
    public RestResult<ArticleDTO> getByPath(@PathVariable @Pattern(regexp = "^[a-z0-9:@._-]+$") String path) {
        ArticleDTO articleDTO = articleService.getByPath(path);
        return RestResult.success(articleDTO);
    }

    @PostMapping
    public RestResult<String> add(@RequestBody @Validated ArticleAddRequest articleAddRequest) {
        ArticleDTO articleDTO = articleService.add(articleAddRequest);
        return RestResult.success(articleDTO.getPath());
    }

    @PutMapping
    public RestResult<String> update(@RequestBody @Validated ArticleUpdateRequest articleUpdateRequest) {
        ArticleDTO articleDTO = articleService.update(articleUpdateRequest);
        return RestResult.success(articleDTO.getPath());
    }

    @Validated
    @DeleteMapping("/{id}")
    public RestResult<Void> delete(@PathVariable @Positive Long id) {
        articleService.delete(id);
        return RestResult.success();
    }

}
