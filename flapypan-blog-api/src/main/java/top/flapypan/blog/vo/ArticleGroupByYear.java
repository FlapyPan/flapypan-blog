package top.flapypan.blog.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import top.flapypan.blog.dto.ArticleSimpleDTO;
import top.flapypan.blog.entity.Article;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ArticleGroupByYear {

    private String year;

    private List<ArticleSimpleDTO> list;

    public ArticleGroupByYear(Integer year, List<Article> articleList) {
        this.year = year.toString();
        this.list = articleList.stream().map(ArticleSimpleDTO::new).toList();
    }

}
