package top.flapypan.blog.vo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
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
public class ArticleUpdateRequest extends UpdateRequest<Article> {

    @Positive
    private Long id;

    @Size(min = 3, max = 32, message = "标题长度应在3-32之间")
    private String title;

    @Size(min = 3, max = 32, message = "路径长度应在3-32之间")
    @Pattern(regexp = "^[a-z0-9:@._-]+$", message = "路径只允许小写字母,数字,冒号,@,英文点,下划线,分隔符")
    private String path;

    private String cover;

    @NotBlank(message = "文章内容不能为空")
    private String content;

    private List<String> tagNames;


    @Override
    public void copyToEntity(Article article) {
        if (StringUtils.hasText(title)) {
            article.setTitle(title);
        }
        if (StringUtils.hasText(path)) {
            article.setPath(path);
        }
        if (StringUtils.hasText(cover)) {
            article.setCover(cover);
        }
        if (StringUtils.hasText(content)) {
            article.setContent(content);
        }
    }

}
