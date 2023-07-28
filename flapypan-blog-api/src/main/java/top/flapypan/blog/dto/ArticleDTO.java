package top.flapypan.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import top.flapypan.blog.entity.Article;
import top.flapypan.blog.entity.Tag;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDTO {

    private Long id;

    private String title;

    private String path;

    private String cover;

    private String content;

    private List<Tag> tags;

    private LocalDateTime createDate;

    private LocalDateTime updateDate;

    public ArticleDTO(Article article) {
        this.id = article.getId();
        this.title = article.getTitle();
        this.path = article.getPath();
        this.cover = article.getCover();
        this.content = article.getContent();
        this.tags = article.getTags();
        this.createDate = article.getCreateDate();
        this.updateDate = article.getUpdateDate();
    }

}
