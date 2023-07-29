package top.flapypan.blog

import cn.dev33.satoken.secure.BCrypt
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class FlapypanBlogApiApplication

fun main(args: Array<String>) {
    if (args.size > 1 && "hash" == args[0]) {
        println(BCrypt.hashpw(args[1], BCrypt.gensalt()))
        return
    }
    runApplication<FlapypanBlogApiApplication>(*args)
}
