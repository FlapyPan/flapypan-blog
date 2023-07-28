package top.flapypan.blog.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import top.flapypan.blog.common.RestResult;
import top.flapypan.blog.service.SettingService;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/setting")
public class SettingController {

    private final SettingService settingService;

    @SaIgnore
    @GetMapping
    public RestResult<Map<String, String>> getSettings() {
        return RestResult.success(settingService.getSettingsMap());
    }

    @PostMapping
    public RestResult<Void> updateSettings(@RequestBody Map<String, String> settingsMap) {
        settingService.saveSettingsMap(settingsMap);
        return RestResult.success();
    }

}
