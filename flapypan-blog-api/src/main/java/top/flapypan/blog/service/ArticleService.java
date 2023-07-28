package top.flapypan.blog.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import top.flapypan.blog.common.RestException;
import top.flapypan.blog.dto.ArticleDTO;
import top.flapypan.blog.dto.ArticleSimpleDTO;
import top.flapypan.blog.entity.Article;
import top.flapypan.blog.repository.ArticleRepository;
import top.flapypan.blog.repository.TagRepository;
import top.flapypan.blog.vo.ArticleAddRequest;
import top.flapypan.blog.vo.ArticleGroupByYear;
import top.flapypan.blog.vo.ArticleUpdateRequest;

import java.util.*;
import java.util.regex.Pattern;

@Slf4j
@RequiredArgsConstructor
@Service
public class ArticleService {

    private final ArticleRepository repository;
    private final TagRepository tagRepository;

    public Page<ArticleSimpleDTO> getPage(Pageable pageable) {
        return repository.findAll(pageable).map(ArticleSimpleDTO::new);
    }

    public Page<ArticleSimpleDTO> searchByKeyword(String keyword, Pageable pageable) {
        return repository.findByKeyword("%" + keyword.toLowerCase() + "%", pageable)
                .map(ArticleSimpleDTO::new);
    }

    public List<ArticleGroupByYear> getGroupByYear() {
        List<Article> all = repository.findAll(Sort.by(Sort.Order.by("createDate").reverse()));
        Map<Integer, List<Article>> map = new TreeMap<>(Comparator.reverseOrder());
        for (Article article : all) {
            int year = article.getCreateDate().getYear();
            if (map.containsKey(year)) {
                map.get(year).add(article);
            } else {
                List<Article> list = new ArrayList<>();
                list.add(article);
                map.put(year, list);
            }
        }
        return map.entrySet().stream()
                .map(entry -> new ArticleGroupByYear(entry.getKey(), entry.getValue()))
                .toList();
    }

    public ArticleDTO getByPath(String path) {
        return repository.findFirstByPath(path)
                .map(ArticleDTO::new)
                .orElseThrow(() -> new RestException(HttpStatus.NOT_FOUND.value(), "不存在的文章"));
    }

    @Transactional
    public ArticleDTO add(ArticleAddRequest addRequest) {
        // 转换为实体
        Article article = addRequest.createEntity();
        // 获取 tag
        List<String> names = addRequest.getTagNames();
        if (names != null && !names.isEmpty()) {
            article.setTags(tagRepository.findAllByNameIn(names));
        }
        return new ArticleDTO(repository.save(article));
    }

    @Transactional
    public ArticleDTO update(ArticleUpdateRequest updateRequest) {
        // 检查 path 有效性
        if (StringUtils.hasText(updateRequest.getPath()) &&
                !Pattern.matches("^[a-z0-9:@._-]+$", updateRequest.getPath())) {
            throw new RestException(HttpStatus.BAD_REQUEST.value(), "path 格式无效");
        }
        Article article = repository.findById(updateRequest.getId())
                .orElseThrow(() -> new RestException(HttpStatus.NOT_FOUND.value(), "不存在的文章"));
        // 复制属性到实体
        updateRequest.copyToEntity(article);
        // 获取 tag
        List<String> names = updateRequest.getTagNames();
        if (names != null && !names.isEmpty()) {
            article.setTags(tagRepository.findAllByNameIn(names));
        }
        return new ArticleDTO(repository.save(article));
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

}
