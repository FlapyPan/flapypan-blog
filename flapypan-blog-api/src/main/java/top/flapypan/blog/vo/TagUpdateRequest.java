package top.flapypan.blog.vo;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.StringUtils;
import top.flapypan.blog.entity.Tag;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagUpdateRequest extends UpdateRequest<Tag> {

    @Positive(message = "无效的id")
    private Long id;

    @Size(min = 2, max = 16, message = "标签名称应在2-16之间")
    private String name;

    @Override
    public void copyToEntity(Tag tag) {
        if (StringUtils.hasText(name)) {
            tag.setName(name);
        }
    }
}
