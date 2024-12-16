package com.myproj.course.service;

import com.myproj.course.controller.ServerStateController;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Scanner;

@Service
public class AdminConsoleService implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminConsoleService.class);
    private final ServerStateService serverStateService;

    public AdminConsoleService(ServerStateService serverStateService) {
        this.serverStateService = serverStateService;
    }

    @Override
    public void run(String... args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        String command;

        logger.info("Admin Console started. Type 'help' for available commands.");

        while (true) {
            logger.info("Enter command: ");
            command = scanner.nextLine().trim();

            switch (command.toLowerCase()) {
                case "exit":
                    logger.info("Shutting down server...");
                    System.exit(0);  // Завершаем приложение
                    break;
                case "help":
                    showHelp();
                    break;
                case "status":
                    showServerStatus();
                    break;
                case "serialize":
                    serializeState();
                    break;
                case "deserialize":
                    deserializeState();
                    break;
                default:
                    logger.info("Unknown command: " + command);
                    break;
            }
        }
    }

    private void showHelp() {
        logger.info("Available commands:");
        logger.info("  help             - Show available commands");
        logger.info("  status           - Show current server status");
        logger.info("  serialize        - Serialize server state to file");
        logger.info("  deserialize      - Deserialize server state from file");
        logger.info("  exit             - Shut down the server");
    }

    private void showServerStatus() {
        logger.info("Current server status: ");
        logger.info("Server Name: " + serverStateService.getCurrentState().getServerName());
        logger.info("Status: " + serverStateService.getCurrentState().getStatus());
        logger.info("Active Connections: " + serverStateService.getCurrentState().getActiveConnections());
    }

    // Сериализация состояния
    private void serializeState() {
        try {
            serverStateService.saveState();
            logger.info("Server state serialized successfully.");
        } catch (Exception e) {
            logger.info("Error during state serialization: " + e.getMessage());
        }
    }

    private void deserializeState() {
        try {
            serverStateService.loadState();
            logger.info("Server state deserialized successfully.");
        } catch (Exception e) {
            logger.info("Error during state deserialization: " + e.getMessage());
        }
    }
}

