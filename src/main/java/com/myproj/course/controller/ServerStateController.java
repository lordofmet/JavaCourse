package com.myproj.course.controller;

import com.myproj.course.model.ServerState;
import com.myproj.course.service.ServerStateService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/server")
public class ServerStateController {
    private final ServerStateService serverStateService;

    public ServerStateController(ServerStateService serverStateService) {
        this.serverStateService = serverStateService;
    }

    // Эндпоинт для увеличения числа активных пользователей
    @PostMapping("/enter")
    public ServerState userEnter() {
        ServerState currentState = serverStateService.getCurrentState();
        currentState.setActiveConnections(currentState.getActiveConnections() + 1);
        serverStateService.saveState(); // Сохраняем обновленное состояние
        return currentState; // Возвращаем обновленное состояние
    }

    // Эндпоинт для уменьшения числа активных пользователей
    @PostMapping("/exit")
    public ServerState userExit() {
        ServerState currentState = serverStateService.getCurrentState();
        // Убедимся, что число активных пользователей не станет отрицательным
        if (currentState.getActiveConnections() > 0) {
            currentState.setActiveConnections(currentState.getActiveConnections() - 1);
        }
        serverStateService.saveState(); // Сохраняем обновленное состояние
        return currentState; // Возвращаем обновленное состояние
    }

    // Эндпоинт для получения текущего состояния сервера
    @GetMapping("/state")
    public ServerState getCurrentState() {
        return serverStateService.getCurrentState();
    }
}

