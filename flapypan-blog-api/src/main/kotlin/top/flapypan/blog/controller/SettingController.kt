package top.flapypan.blog.controller

import cn.dev33.satoken.annotation.SaIgnore
import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.restOk
import top.flapypan.blog.service.SettingService

@RestController
@RequestMapping("/setting")
class SettingController(
    private val settingService: SettingService
) {

    @GetMapping
    @SaIgnore
    fun getSettings() = settingService.getSettingsMap().restOk()

    @PostMapping
    fun updateSettings(@RequestBody settingsMap: Map<String, String?>) =
        settingService.saveSettingsMap(settingsMap).restOk()
}
