import React, { useState } from 'react'
import axios from 'axios'
import ChatBotIcon from '../../../assets/images/message-solid.svg'
import Xmark from '../../../assets/images/xmark-solid.svg'
import Send from '../../../assets/images/send.svg'
import './AiChatbot.css'

const AiChatbot = () => {
  // Start with an empty message list
  const [messages, setMessages] = useState([])

  // Track whether the chatbot is open or closed
  const [isOpen, setIsOpen] = useState(false)

  // Track the user’s current input
  const [input, setInput] = useState('')

  // Function to send a message to the backend
  const handleSendMessage = async () => {
    if (!input.trim()) return // Don't send empty messages

    // 1. Add the user’s message to the chat
    const userMessage = { text: input, sender: 'user' }
    setMessages((prev) => [...prev, userMessage])

    // Save the input, then clear it
    const userQuery = input
    setInput('')

    try {
      // 2. POST the query to your Laravel endpoint
      //    Make sure this URL matches your actual server route & port
      const response = await axios.post('http://localhost:8001/api/v0.1/support', {
        query: userQuery
      })

      // 3. Get the AI’s reply from the backend response
      const aiReply = response.data.reply || 'I did not understand, please try again.'

      // 4. Add the AI's response to the chat
      const aiMessage = { text: aiReply, sender: 'ai' }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error fetching AI response:', error)
      // Show an error message in the chat if something goes wrong
      setMessages((prev) => [
        ...prev,
        { text: 'Error: Unable to fetch response.', sender: 'ai' }
      ])
    }
  }

  return !isOpen ? (
    <div className='closed-chatbot' onClick={() => setIsOpen(true)}>
      <img className='chatbot-icon-closed' src={ChatBotIcon} alt='chatbot icon' />
    </div>
  ) : (
    <div className='chatbot-container'>
      <div className='chatbot-title'>
        <div>Ask Ai Chatbot!</div>
        <img src={Xmark} alt='close' onClick={() => setIsOpen(false)} />
      </div>

      <div className='chatbot-messages'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
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
          <img src={Send} alt='send' onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}

export default AiChatbot
