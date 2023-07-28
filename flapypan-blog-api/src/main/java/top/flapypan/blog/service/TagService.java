package top.flapypan.blog.service;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.flapypan.blog.common.RestException;
import top.flapypan.blog.dto.ArticleSimpleDTO;
import top.flapypan.blog.dto.TagDTO;
import top.flapypan.blog.entity.Tag;
import top.flapypan.blog.repository.ArticleRepository;
import top.flapypan.blog.repository.TagRepository;
import top.flapypan.blog.vo.TagAddRequest;
import top.flapypan.blog.vo.TagUpdateRequest;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class TagService {

    private final TagRepository repository;
    private final ArticleRepository articleRepository;

    public List<TagDTO> getAll() {
        return repository.getTagDTOList();
    }

    public Tag findByName(String name) {
        return repository.findByName(name)
                .orElseThrow(() -> new RestException(HttpStatus.NOT_FOUND.value(), "不存在的标签"));
    }

    @Transactional
    public Tag add(TagAddRequest addRequest) {
        Tag tag = addRequest.createEntity();
        if (repository.exists(Example.of(tag))) {
            throw new RestException(HttpStatus.BAD_REQUEST.value(), "标签已经存在");
        }
        return repository.save(tag);
    }

    @Transactional
    public Tag update(TagUpdateRequest updateRequest) {
        Tag tag = repository.findById(updateRequest.getId())
                .orElseThrow(() -> new RestException(HttpStatus.NOT_FOUND.value(), "不存在的标签"));
        updateRequest.copyToEntity(tag);
        return repository.save(tag);
    }

    @Transactional
    public void delete(@Positive Long id) {
        repository.deleteArticleTagByTagId(id);
        repository.deleteById(id);
    }

    public Page<ArticleSimpleDTO> getArticleByTag(String tagName, Pageable pageable) {
        repository.findByName(tagName)
                .orElseThrow(() -> new RestException(HttpStatus.NOT_FOUND.value(), "不存在的标签"));
        return articleRepository
                .findAllByTagsName(tagName, pageable)
                .map(ArticleSimpleDTO::new);
    }


}
