package top.flapypan.blog.common

import cn.dev33.satoken.stp.StpUtil

inline fun <R> checkLogin(block: () -> R): R {
    StpUtil.checkLogin()
    return block()
}
