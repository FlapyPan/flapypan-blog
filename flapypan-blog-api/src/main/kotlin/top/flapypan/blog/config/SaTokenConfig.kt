package top.flapypan.blog.config

import cn.dev33.satoken.interceptor.SaInterceptor
import cn.dev33.satoken.stp.StpUtil
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class SaTokenConfig : WebMvcConfigurer {
    override fun addInterceptors(registry: InterceptorRegistry) {
        // 使用SaToken拦截器，将自动开启注解鉴权
        registry.addInterceptor(SaInterceptor {
            StpUtil.checkLogin()
        }).apply {
            addPathPatterns("/**") // 拦截的路径
            excludePathPatterns( // 放行路径
                "/static/**",
                "/auth/**",
                "/api-docs*/**",
                "/swagger-ui*/**",
                "/webjars/**"
            )
        }
    }
}
