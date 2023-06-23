from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules import login
from modules import register
from modules import deposit
from modules import create_item
from modules import render_home

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router)
app.include_router(register.router)
app.include_router(deposit.router)
app.include_router(create_item.router)
app.include_router(render_home.router)
