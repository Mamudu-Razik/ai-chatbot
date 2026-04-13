"use client"
import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"

type Message = {
  role: string
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const res = await fetch("https://ai-chatbot-backend-fdpu.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    })

    const data = await res.json()
    const aiMessage: Message = { role: "assistant", content: data.reply }
    setMessages((prev) => [...prev, aiMessage])
    setLoading(false)
  }

  return (
    <main className="flex flex-col h-screen bg-[#0f0f13] text-white">

      {/* Header */}
      <div className="p-4 border-b border-gray-800 text-center">
        <h1 className="text-xl font-semibold">AI Chatbot 🤖</h1>
        <p className="text-gray-500 text-sm">Powered by Groq AI</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-4xl mb-4">🤖</p>
            <p className="text-gray-400 text-lg font-medium">How can I help you today?</p>
            <p className="text-gray-600 text-sm mt-1">Ask me anything!</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* AI Avatar */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm mr-2 mt-1 shrink-0">
                AI
              </div>
            )}

            <div
              className={`max-w-xs md:max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-[#1e1e2a] text-gray-100 rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown
                  components={{
                    code: ({ children }) => (
                      <code className="bg-gray-900 px-1.5 py-0.5 rounded text-green-400 text-xs font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 p-3 rounded-lg mt-2 mb-2 overflow-x-auto text-xs font-mono text-green-400">
                        {children}
                      </pre>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">{children}</strong>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm ml-2 mt-1 shrink-0">
                Me
              </div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {loading && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm shrink-0">
              AI
            </div>
            <div className="bg-[#1e1e2a] px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          </div>
        )}

        {/* Auto scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-[#1e1e2a] text-white rounded-full px-5 py-3 outline-none border border-gray-700 focus:border-blue-500 transition-colors text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-full font-medium text-sm transition-colors"
          >
            Send
          </button>
        </div>
      </div>

    </main>
  )
}