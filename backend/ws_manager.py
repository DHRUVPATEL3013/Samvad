from fastapi import WebSocket
from typing import Dict, List
import json
from models import Message,MessageStatus,User
from sqlalchemy.orm import Session
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, phone: str, websocket: WebSocket,db:Session):
        await websocket.accept()
        if phone not in self.active_connections:
            self.active_connections[phone] = []
        self.active_connections[phone].append(websocket)
        print(f"User {phone} connected. Total connections: {len(self.active_connections[phone])}")
        peer = db.query(User).filter(User.phone == phone).first()

        undelivered_msgs = db.query(Message).filter(
            Message.recipient_id == peer.id,
            Message.status == MessageStatus.sent
        ).all()

        # undelivered_msgs = db.query(Message).filter(
        # Message.recipient.has(phone=phone),
        # Message.status == MessageStatus.sent
        #                     ).all()

        for msg in undelivered_msgs:
            msg.status = MessageStatus.delivered

              
            sender = db.query(User).filter(User.id == msg.sender_id).first()
            if sender and self.is_online(sender.phone):
                await self.send_personal(sender.phone, {
                    "type": "delivered",
                    "id": str(msg.id)
                })

        db.commit()

    def disconnect(self, phone: str, websocket: WebSocket):
        if phone in self.active_connections:
            self.active_connections[phone].remove(websocket)
            if not self.active_connections[phone]:
                del self.active_connections[phone]
        print(f"User {phone} disconnected. Remaining connections: {len(self.active_connections.get(phone, []))}")

    async def send_personal(self, phone: str, message: dict):
        """Send message to a specific user by email"""
        if phone in self.active_connections:
            for connection in self.active_connections[phone]:
                try:
                    await connection.send_json(message)
                    print(f"Message sent to {phone}: {message}")
                except Exception as e:
                    print(f"Error sending to {phone}: {e}")
        else:
            print(f"No active connections for {phone}")

    def is_online(self, phone: str):
        return phone in self.active_connections


manager = ConnectionManager()