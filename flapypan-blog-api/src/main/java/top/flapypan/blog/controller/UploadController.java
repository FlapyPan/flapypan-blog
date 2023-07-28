package top.flapypan.blog.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import top.flapypan.blog.common.RestException;
import top.flapypan.blog.common.RestResult;
import top.flapypan.blog.service.UploadService;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/upload")
public class UploadController {

    private final UploadService uploadService;

    @PostMapping
    public RestResult<String> add(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        // 限制为图片
        String contentType = multipartFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RestException(HttpStatus.BAD_REQUEST.value(), "错误的文件类型");
        }
        return RestResult.success(uploadService.upload(multipartFile));
    }

}
