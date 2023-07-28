package top.flapypan.blog.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.flapypan.blog.entity.Link;
import top.flapypan.blog.repository.LinkRepository;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class LinkService {

    private final LinkRepository repository;

    public List<Link> getAll() {
        return repository.findAll();
    }

    @Transactional
    public List<Link> save(List<Link> links) {
        repository.deleteAll();
        return repository.saveAll(links);
    }
}
