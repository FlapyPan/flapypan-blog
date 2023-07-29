package top.flapypan.blog.common

import org.springframework.http.HttpStatus

private val OK_STATUS = HttpStatus.OK.value()

/**
 * 统一返回结构
 */
data class RestResult<T>(val code: Int, val data: T) {
    val success get() = code == OK_STATUS
}

fun success(): RestResult<Nothing?> = RestResult(OK_STATUS, null)

fun <T> success(data: T): RestResult<T> = RestResult(OK_STATUS, data)

fun failure(code: Int): RestResult<Nothing?> = RestResult(code, null)

fun <T> failure(code: Int, data: T): RestResult<T> = RestResult(code, data)
