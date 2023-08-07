package top.flapypan.blog

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@SpringBootApplication
class FlapypanBlogApiApplication

fun main(args: Array<String>) {
    if (args.size > 1 && "hash" == args[0]) {
        println(BCryptPasswordEncoder().encode(args[1]))
        return
    }
    runApplication<FlapypanBlogApiApplication>(*args)
}
