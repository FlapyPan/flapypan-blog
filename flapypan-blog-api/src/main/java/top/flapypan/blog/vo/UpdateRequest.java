package top.flapypan.blog.vo;

public abstract class UpdateRequest<Entity> {
    /**
     * 按需复制需要更新的值
     */
    public abstract void copyToEntity(Entity entity);

}
