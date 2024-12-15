package com.myproj.course.controller;

import com.myproj.course.model.ServerState;
import com.myproj.course.service.ServerStateService;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/server")
public class ServerStateController {
    private static final Logger logger = LoggerFactory.getLogger(ServerStateController.class);
    private final ServerStateService serverStateService;

    public ServerStateController(ServerStateService serverStateService) {
        this.serverStateService = serverStateService;
    }

    @PostMapping("/enter")
    public ServerState userEnter() {
        logger.info("User entering the system.");
        ServerState currentState = serverStateService.getCurrentState();
        currentState.setActiveConnections(currentState.getActiveConnections() + 1);
        serverStateService.saveState();
        return currentState;
    }

    @PostMapping("/exit")
    public ServerState userExit() {
        logger.info("User exiting the system.");
        ServerState currentState = serverStateService.getCurrentState();
        if (currentState.getActiveConnections() > 0) {
            currentState.setActiveConnections(currentState.getActiveConnections() - 1);
        }
        serverStateService.saveState();
        return currentState;
    }

    @GetMapping("/state")
    public ServerState getCurrentState() {
        logger.info("Getting current server state.");
        return serverStateService.getCurrentState();
    }
}

