import React, { useState } from 'react'
import ChatBotIcon from '../../../assets/images/message-solid.svg'
import Xmark from '../../../assets/images/xmark-solid.svg'
import Send from '../../../assets/images/send.svg'

import './AiChatbot.css'

const AiChatbot = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello, AI!', sender: 'user' },
    { text: 'Hi! How can I assist you today?', sender: 'ai' },
  ])
  const [isOpen, setIsOpen] = useState(false)

  const [input, setInput] = useState('')

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }])
      setInput('')
    }
  }

  return !isOpen ? (
    <div
      className='closed-chatbot'
      onClick={() => setIsOpen(true)}
    >
      <img
        className='chatbot-icon-closed'
        src={ChatBotIcon}
        alt='chatbot.svg'
      />
    </div>
  ) : (
    <div className='chatbot-container'>
      <div className='chatbot-title'>
        <div>Ask Ai Chatbot!</div>{' '}
        <img
          src={Xmark}
          alt=''
          onClick={() => setIsOpen(false)}
        />
      </div>

      <div className='chatbot-messages'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === 'user' ? 'user-message' : 'ai-message'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className='chatbot-input-container'>
        <input
          type='text'
          className='chatbot-input'
          placeholder='Type your message...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />

        <div className='send-backgroung'>
          <img
            src={Send}
            alt=''
            onClick={() => handleSendMessage()}
          />
        </div>
      </div>
    </div>
  )
}

export default AiChatbot
