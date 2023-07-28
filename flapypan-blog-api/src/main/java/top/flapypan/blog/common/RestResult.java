package top.flapypan.blog.common;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 统一返回结构
 */
@AllArgsConstructor
public class RestResult<T> {
    @JsonIgnore
    public static final int OK_STATUS = HttpStatus.OK.value();

    @Getter
    private int code;
    @Getter
    private T data;

    public boolean isSuccess() {
        return code == OK_STATUS;
    }

    public static <T> RestResult<T> success() {
        return new RestResult<>(OK_STATUS, null);
    }

    public static <T> RestResult<T> success(T data) {
        return new RestResult<>(OK_STATUS, data);
    }

    public static <T> RestResult<T> failure(int code) {
        return new RestResult<>(code, null);
    }

    public static <T> RestResult<T> failure(int code, T data) {
        return new RestResult<>(code, data);
    }
}
