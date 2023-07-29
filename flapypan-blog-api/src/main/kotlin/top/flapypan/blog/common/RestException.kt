package top.flapypan.blog.common

/**
 * 自定义业务异常
 */
class RestException : RuntimeException {
    val code: Int

    constructor(code: Int, message: String?) : super(message) {
        this.code = code
    }

    constructor(code: Int, message: String?, cause: Throwable?) : super(message, cause) {
        this.code = code
    }

    constructor(code: Int, cause: Throwable?) : super(cause) {
        this.code = code
    }
}
