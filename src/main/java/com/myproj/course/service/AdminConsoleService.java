package com.myproj.course.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Scanner;

@Service
public class AdminConsoleService implements CommandLineRunner {
    private final ServerStateService serverStateService;

    public AdminConsoleService(ServerStateService serverStateService) {
        this.serverStateService = serverStateService;
    }

    @Override
    public void run(String... args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        String command;

        System.out.println("Admin Console started. Type 'help' for available commands.");

        while (true) {
            // Ожидаем ввода команды
            System.out.print("Enter command: ");
            command = scanner.nextLine().trim();

            // Обработка команд
            switch (command.toLowerCase()) {
                case "exit":
                    System.out.println("Shutting down server...");
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
                    System.out.println("Unknown command: " + command);
                    break;
            }
        }
    }

    // Показать доступные команды
    private void showHelp() {
        System.out.println("Available commands:");
        System.out.println("  help             - Show available commands");
        System.out.println("  status           - Show current server status");
        System.out.println("  serialize        - Serialize server state to file");
        System.out.println("  deserialize      - Deserialize server state from file");
        System.out.println("  exit             - Shut down the server");
    }

    // Показать текущее состояние сервера
    private void showServerStatus() {
        System.out.println("Current server status: ");
        System.out.println("Server Name: " + serverStateService.getCurrentState().getServerName());
        System.out.println("Status: " + serverStateService.getCurrentState().getStatus());
        System.out.println("Active Connections: " + serverStateService.getCurrentState().getActiveConnections());
    }

    // Сериализация состояния
    private void serializeState() {
        try {
            serverStateService.saveState();
            System.out.println("Server state serialized successfully.");
        } catch (Exception e) {
            System.out.println("Error during state serialization: " + e.getMessage());
        }
    }

    // Десериализация состояния
    private void deserializeState() {
        try {
            serverStateService.loadState();
            System.out.println("Server state deserialized successfully.");
        } catch (Exception e) {
            System.out.println("Error during state deserialization: " + e.getMessage());
        }
    }
}

