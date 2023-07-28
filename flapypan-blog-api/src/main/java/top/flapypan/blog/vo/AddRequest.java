package top.flapypan.blog.vo;

public abstract class AddRequest<Entity> {

    /**
     * 构建新的实体
     */
    public abstract Entity createEntity();

}
