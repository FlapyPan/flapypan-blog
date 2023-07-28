package top.flapypan.blog.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.flapypan.blog.entity.Setting;
import top.flapypan.blog.repository.SettingRepository;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class SettingService {

    // 默认设置
    public static final Map<String, String> DEFAULT_SETTINGS = Map.of(
            "siteTitle", "FlapyPan's Blog",
            "favicon", "/avatar.webp",
            "avatar", "/avatar.webp",
            "banner", "/banner.webp",
            "name", "FlapyPan",
            "email", "flapypan@gmail.com",
            "info", "个人博客",
            "pageSize", "12",
            "footer", "Copyright"
    );

    private final SettingRepository repository;

    public void initDefaultSettings() {
        int defaultSize = DEFAULT_SETTINGS.size();
        if (repository.count() >= defaultSize) return;
        synchronized (SettingService.class) {
            // 获取已经有的key
            Set<String> allKey = repository.findAllKey();
            // 求差集
            Set<String> keysToAdd = new HashSet<>(DEFAULT_SETTINGS.keySet());
            keysToAdd.removeAll(allKey);
            // 生成需要插入的值
            List<Setting> settingsToAdd = keysToAdd.stream()
                    .map(key -> new Setting(key, DEFAULT_SETTINGS.get(key)))
                    .toList();
            int size = repository.saveAllAndFlush(settingsToAdd).size();
            log.info("添加了 {} 项默认设置", size);
        }
    }

    public Map<String, String> getSettingsMap() {
        initDefaultSettings();
        return repository
                .findAll()
                .stream()
                .collect(Collectors.toMap(Setting::getKey, Setting::getValue));
    }

    @Transactional
    public void saveSettingsMap(Map<String, String> settingsMap) {
        List<Setting> settingsWillSaved = repository.findAll().stream() // 获取所有设置
                .filter(s -> settingsMap.containsKey(s.getKey())) // 过滤掉无需存储的
                .filter(s -> !Objects.equals(settingsMap.get(s.getKey()), s.getValue())) // 过滤掉值相等的
                .peek(s -> s.setValue(settingsMap.get(s.getKey()))) // 设置新值
                .toList();
        repository.saveAllAndFlush(settingsWillSaved);
    }

}
