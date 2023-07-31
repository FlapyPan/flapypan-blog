package top.flapypan.blog.controller

import org.springframework.web.bind.annotation.*
import top.flapypan.blog.common.checkLogin
import top.flapypan.blog.common.restOk
import top.flapypan.blog.service.SettingService

@RestController
@RequestMapping("/setting")
class SettingController(
    private val settingService: SettingService
) {

    @GetMapping
    fun getSettings() = settingService.getSettingsMap().restOk()

    @PostMapping
    fun updateSettings(@RequestBody settingsMap: Map<String, String?>) =
        checkLogin { settingService.saveSettingsMap(settingsMap).restOk() }
}
