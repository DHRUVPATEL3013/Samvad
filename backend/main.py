from fastapi import FastAPI
from database import Base,engine
from fastapi.middleware.cors import CORSMiddleware
from routers import users,messages,web_s

Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/auth")
app.include_router(messages.router)
app.include_router(web_s.router)