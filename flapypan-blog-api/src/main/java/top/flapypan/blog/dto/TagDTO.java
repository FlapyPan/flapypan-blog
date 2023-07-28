package top.flapypan.blog.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TagDTO {

    private Long id;

    private String name;

    private Long count;

    // 如果这里使用 lombok 注解，idea 提示的 hql 会爆红
    public TagDTO(Long id, String name, Long count) {
        this.id = id;
        this.name = name;
        this.count = count;
    }
}
