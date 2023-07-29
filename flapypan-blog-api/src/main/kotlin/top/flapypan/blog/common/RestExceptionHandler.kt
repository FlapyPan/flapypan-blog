package top.flapypan.blog.common

import cn.dev33.satoken.exception.SaTokenException
import jakarta.servlet.ServletException
import org.springframework.http.HttpStatus
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice
import top.flapypan.blog.common.RestException

/**
 * 全局异常处理类
 */
@RestControllerAdvice
class RestExceptionHandler {

    val log by LoggerDelegate()

    /**
     * sa token 异常处理
     */
    @ExceptionHandler(SaTokenException::class)
    @ResponseStatus(HttpStatus.OK)
    fun handleSaTokenException(e: SaTokenException?): RestResult<Nothing?> {
        return failure(HttpStatus.UNAUTHORIZED.value())
    }

    /**
     * Spring Validation 异常处理
     */
    @ExceptionHandler(MethodArgumentNotValidException::class)
    @ResponseStatus(HttpStatus.OK)
    fun handleMethodArgumentNotValid(e: MethodArgumentNotValidException): RestResult<String?> {
        val objectError = e.bindingResult.allErrors[0]
        val message = objectError.defaultMessage
        log.warn("字段错误 $message")
        return failure(HttpStatus.BAD_REQUEST.value(), message)
    }

    /**
     * 业务异常处理
     */
    @ExceptionHandler(RestException::class)
    @ResponseStatus(HttpStatus.OK)
    fun handleRestException(e: RestException): RestResult<String?> {
        log.error("业务错误", e)
        return failure(e.code, e.message)
    }

    @ExceptionHandler(ServletException::class)
    @ResponseStatus(HttpStatus.OK)
    fun handleServletException(e: ServletException): RestResult<String?> {
        return failure(HttpStatus.BAD_REQUEST.value(), e.message)
    }

    /**
     * 其他异常处理
     */
    @ExceptionHandler(Exception::class)
    @ResponseStatus(HttpStatus.OK)
    fun handleException(e: Exception?): RestResult<Nothing?> {
        log.error("服务器内部错误", e)
        return failure(HttpStatus.INTERNAL_SERVER_ERROR.value())
    }

}
