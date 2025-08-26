from fastapi import WebSocket
from typing import Dict, List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, email: str, websocket: WebSocket):
        await websocket.accept()
        if email not in self.active_connections:
            self.active_connections[email] = []
        self.active_connections[email].append(websocket)
        print(f"User {email} connected. Total connections: {len(self.active_connections[email])}")

    def disconnect(self, email: str, websocket: WebSocket):
        if email in self.active_connections:
            self.active_connections[email].remove(websocket)
            if not self.active_connections[email]:
                del self.active_connections[email]
        print(f"User {email} disconnected. Remaining connections: {len(self.active_connections.get(email, []))}")

    async def send_personal(self, email: str, message: dict):
        """Send message to a specific user by email"""
        if email in self.active_connections:
            for connection in self.active_connections[email]:
                try:
                    await connection.send_json(message)
                    print(f"Message sent to {email}: {message}")
                except Exception as e:
                    print(f"Error sending to {email}: {e}")
        else:
            print(f"No active connections for {email}")

manager = ConnectionManager()