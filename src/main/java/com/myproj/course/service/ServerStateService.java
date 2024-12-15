package com.myproj.course.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myproj.course.model.ServerState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
@EnableScheduling
public class ServerStateService {
    private static final Logger logger = LoggerFactory.getLogger(ServerStateService.class);
    private final ObjectMapper objectMapper;
    private final File stateFile;
    private ServerState currentState;

    // Конструктор, где получаем путь к файлу из конфигурации
    public ServerStateService(@Value("${server.state.file}") String filePath, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.stateFile = new File(filePath);
        this.currentState = new ServerState(); // Инициализация пустого состояния
        logger.info("ServerStateService initialized with file: {}", filePath);
    }

    // Загружаем состояние при старте приложения
    @EventListener(ContextRefreshedEvent.class)
    public void loadState() {
        if (stateFile.exists() && stateFile.length() > 0) {
            try {
                // Чтение состояния из JSON файла
                currentState = objectMapper.readValue(stateFile, ServerState.class);
                logger.info("Server state loaded: {}", currentState);
            } catch (IOException e) {
                logger.error("Failed to load server state from file. Initializing with empty state.", e);
                currentState = new ServerState(); // Инициализация пустого состояния
            }
        } else {
            logger.warn("State file not found or is empty. Initializing with empty state.");
            currentState = new ServerState(); // Инициализация пустого состояния
        }
    }

    // Сохраняем состояние при завершении работы приложения
    @EventListener(ContextClosedEvent.class)
    public void saveState() {
        try {
            // Записываем состояние в JSON файл
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(stateFile, currentState);
            logger.info("Server state successfully saved to file: {}", stateFile.getAbsolutePath());
        } catch (IOException e) {
            logger.error("Failed to save server state to file.", e);
        }
    }

    public ServerState getCurrentState() {
        return currentState;
    }

    public void updateState(ServerState newState) {
        this.currentState = newState;
        saveState(); // Сохранение состояния сразу после обновления
    }

    // Периодическое сохранение состояния
    @Scheduled(fixedRate = 60000) // Каждую минуту
    public void periodicSaveState() {
        saveState();
        logger.info("Periodic state save executed.");
    }
}
