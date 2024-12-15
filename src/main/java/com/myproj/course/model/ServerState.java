package com.myproj.course.model;

import java.io.Serializable;
import java.util.Map;

public class ServerState implements Serializable {
    private static final long serialVersionUID = 1L;
    private String serverName;
    private String status;
    private int activeConnections;

    // Конструкторы
    public ServerState() {
        serverName = "MainServ";
        status = "running";
        activeConnections = 0;
    }

    public ServerState(String serverName, String status, int activeConnections) {
        this.serverName = serverName;
        this.status = status;
        this.activeConnections = activeConnections;
    }

    // Геттеры и сеттеры
    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getActiveConnections() {
        return activeConnections;
    }

    public void setActiveConnections(int activeConnections) {
        this.activeConnections = activeConnections;
    }

    @Override
    public String toString() {
        return "ServerState{" +
                "serverName='" + serverName + '\'' +
                ", status='" + status + '\'' +
                ", activeConnections=" + activeConnections +
                '}';
    }
}
