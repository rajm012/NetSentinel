# backend/api/routes/ws.py
from fastapi import APIRouter, WebSocket

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        print(f"Received: {data}")
        await websocket.send_text(f"Echo: {data}")
        print(f"Sent: Echo: {data}")


#-----------------To test the websocket connection------------------ 
