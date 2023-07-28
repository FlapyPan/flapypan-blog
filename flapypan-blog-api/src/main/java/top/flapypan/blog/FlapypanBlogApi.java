package top.flapypan.blog;

import cn.dev33.satoken.secure.BCrypt;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class FlapypanBlogApi {

    public static void main(String[] args) {
        if (args.length > 1 && "hash".equals(args[0])) {
            String pwd = BCrypt.hashpw(args[1], BCrypt.gensalt());
            System.out.println(pwd);
            return;
        }
        SpringApplication.run(FlapypanBlogApi.class, args);
    }

}
