package top.flapypan.blog.vo;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import top.flapypan.blog.entity.Tag;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagAddRequest extends AddRequest<Tag> {

    @Size(min = 2, max = 16, message = "标签名称应在2-16之间")
    private String name;

    @Override
    public Tag createEntity() {
        Tag tag = new Tag();
        tag.setName(name);
        return tag;
    }
}
