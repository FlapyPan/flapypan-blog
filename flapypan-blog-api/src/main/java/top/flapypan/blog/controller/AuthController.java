package top.flapypan.blog.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import cn.dev33.satoken.secure.BCrypt;
import cn.dev33.satoken.stp.StpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import top.flapypan.blog.common.RestResult;
import top.flapypan.blog.vo.LoginRequest;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Value("${blog.username}")
    private String username;
    @Value("${blog.password}")
    private String password;

    /**
     * 登录返回 token
     */
    @SaIgnore
    @PostMapping
    public RestResult<Void> login(@RequestBody @Validated LoginRequest loginRequest) {
        if (loginRequest.getUsername().equals(username)
                && BCrypt.checkpw(loginRequest.getPassword(), password)) {
            StpUtil.login(loginRequest.getUsername());
            return RestResult.success();
        }
        return RestResult.failure(HttpStatus.UNAUTHORIZED.value());
    }

    /**
     * 检查登录状态
     */
    @SaIgnore
    @GetMapping
    public RestResult<Boolean> check() {
        return RestResult.success(StpUtil.isLogin());
    }

    /**
     * 退出登录
     */
    @SaIgnore
    @GetMapping("/logout")
    public RestResult<Void> logout() {
        StpUtil.logout();
        return RestResult.success();
    }


}
