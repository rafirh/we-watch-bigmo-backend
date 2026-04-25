import { WebSocket } from "ws";
import { WsServerMessage } from "../models/consultation.model";

class ConnectionManager {
  private connections = new Map<string, Set<WebSocket>>();

  add(userId: string, socket: WebSocket): void {
    if (!this.connections.has(userId)) {
      this.connections.set(userId, new Set());
    }
    this.connections.get(userId)!.add(socket);
  }

  remove(userId: string, socket: WebSocket): boolean {
    const set = this.connections.get(userId);
    if (!set) return false;
    set.delete(socket);
    if (set.size === 0) {
      this.connections.delete(userId);
      return true; // user benar-benar offline
    }
    return false;
  }

  isOnline(userId: string): boolean {
    return this.connections.has(userId);
  }

  send(userId: string, message: WsServerMessage): void {
    const set = this.connections.get(userId);
    if (!set) return;
    const payload = JSON.stringify(message);
    for (const socket of set) {
      try {
        if (socket.readyState === socket.OPEN) {
          socket.send(payload);
        }
      } catch {
        // ignore — socket akan di-cleanup oleh handler close
      }
    }
  }

  sendToMany(userIds: string[], message: WsServerMessage): void {
    for (const id of userIds) this.send(id, message);
  }
}

export const connectionManager = new ConnectionManager();
