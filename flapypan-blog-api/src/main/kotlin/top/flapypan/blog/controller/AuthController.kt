package top.flapypan.blog.controller

import cn.dev33.satoken.annotation.SaIgnore
import cn.dev33.satoken.secure.BCrypt
import cn.dev33.satoken.stp.StpUtil
import jakarta.validation.constraints.NotBlank
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.RestResult
import top.flapypan.blog.common.restErr
import top.flapypan.blog.common.restOk

@RestController
@RequestMapping("/auth")
class AuthController(

    @Value("\${blog.username}")
    private val username: String,

    @Value("\${blog.password}")
    private val password: String
) {

    /**
     * 登录返回 token
     */
    @PostMapping
    fun login(@RequestBody @Validated loginRequest: LoginRequest): RestResult<String?> {
        if (username == loginRequest.username && BCrypt.checkpw(loginRequest.password, password)) {
            StpUtil.login(username)
            return "登录成功".restOk()
        }
        return "用户名或密码错误".restErr(HttpStatus.UNAUTHORIZED.value())
    }

    /**
     * 检查登录状态
     */
    @GetMapping
    fun check() = StpUtil.isLogin().restOk()

    /**
     * 退出登录
     */
    @GetMapping("/logout")
    fun logout() = StpUtil.logout().restOk()
}

data class LoginRequest(

    @field:NotBlank(message = "用户名不能为空")
    val username: String,

    @field:NotBlank(message = "密码不能为空")
    val password: String

)
