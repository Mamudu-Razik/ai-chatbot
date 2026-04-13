from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

# This is a CLASS — like a blueprint
class ChatBot:
    # __init__ runs when you CREATE the chatbot
    # Same as constructor() in JavaScript!
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        self.chat_history = []  # stores conversation history

    # This METHOD sends a message and gets a reply
    def send_message(self, message: str) -> str:
        # Add user message to history
        self.chat_history.append({
            "role": "user",
            "content": message
        })

        # Send to Groq AI
        response = self.client.chat.completions.create(
            model=self.model,
            messages=self.chat_history
        )

        # Get reply
        reply = response.choices[0].message.content

        # Add AI reply to history
        self.chat_history.append({
            "role": "assistant",
            "content": reply
        })

        return reply

# This is your REQUEST model
class MessageRequest(BaseModel):
    message: str

# Create FastAPI app
app = FastAPI()

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create ONE chatbot instance
chatbot = ChatBot()

# Endpoint
@app.post("/chat")
def chat(req: MessageRequest):
    reply = chatbot.send_message(req.message)
    return {"reply": reply}