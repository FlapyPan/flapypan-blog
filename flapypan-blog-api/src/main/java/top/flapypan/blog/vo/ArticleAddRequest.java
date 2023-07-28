package top.flapypan.blog.vo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.StringUtils;
import top.flapypan.blog.entity.Article;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleAddRequest extends AddRequest<Article> {

    @Size(min = 3, max = 32, message = "标题长度应在3-32之间")
    private String title;

    @Size(min = 3, max = 64, message = "路径长度应在3-32之间")
    @Pattern(regexp = "^[a-z0-9:@._-]+$", message = "路径只允许小写字母,数字,冒号,@,英文点,下划线,分隔符")
    private String path;

    private String cover;

    @NotBlank(message = "文章内容不能为空")
    private String content;

    private List<String> tagNames;

    @Override
    public Article createEntity() {
        Article article = new Article();
        article.setTitle(title);
        // 没有指定路径则使用标题
        article.setPath(StringUtils.hasText(path) ? path : title);
        article.setCover(cover);
        article.setContent(content);
        return article;
    }

}
