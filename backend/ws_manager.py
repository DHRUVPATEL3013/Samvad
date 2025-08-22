from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, email: str, websocket: WebSocket):
        await websocket.accept()
        if email not in self.active_connections:
            self.active_connections[email] = []
        self.active_connections[email].append(websocket)

    def disconnect(self, email: str, websocket: WebSocket):
        if email in self.active_connections:
            self.active_connections[email].remove(websocket)
            if not self.active_connections[email]:
                del self.active_connections[email]

    async def send_personal(self, email: str, message: dict):
        if email in self.active_connections:
            for ws in self.active_connections[email]:
                await ws.send_json(message)
