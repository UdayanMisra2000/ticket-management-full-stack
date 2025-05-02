import React, { useState, useEffect } from 'react';
import './ChatBot.css';
import icon from '../Images/Floating Action Button.png';
import avatar from '../Images/Avatar.png';
import send from '../Images/Send.png';
import closeIcon from '../Images/FloatingCrossButton.png';

export default function ChatBot() {
  // default design
  const [design, setDesign] = useState({
    headerColor: '#33475B',
    backgroundColor: '#FAFBFC',
    customMessages: ['How can I help you?', 'Ask me anything!'],
    welcomeMessage: '👋 Want to chat about Hubly? I’m here to help you find your way.',
    missedChatTimer: '01:00:00'
  });

  // placeholders live in component since not in your model
  const placeholders = {
    name: 'Your name',
    phone: '+1 (000) 000-0000',
    email: 'example@gmail.com'
  };

  const [showTooltip, setShowTooltip] = useState(true);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [ticketId, setTicketId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  // Load design once and merge it
  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const res = await fetch('https://ticket-management-full-stack.onrender.com/chatbot/design');
        const data = await res.json();
        setDesign(prev => ({ ...prev, ...data }));
        // initialize chat preview messages
        setMessages((data.customMessages || prev.customMessages).map(txt => ({ type: 'bot', text: txt })));
      } catch (error) {
        console.error(error);
      }
    };
    fetchDesign();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');

    console.log('User message:', userMsg);
    console.log('email:', email);
    console.log('ticketId:', ticketId);

    try {
      if (!ticketId) {
        const ticketResp = await fetch('https://ticket-management-full-stack.onrender.com/tickets/create-or-get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, query: userMsg })
        });
        const ticketData = await ticketResp.json();
        if (ticketData.ticket) {
          setTicketId(ticketData.ticket._id);
          setMessages(ticketData.ticket.messages.map(m => ({ type: m.sender, text: m.text })));
        }
      } else {
        const response = await fetch(`https://ticket-management-full-stack.onrender.com/tickets/${ticketId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sender: 'user', text: userMsg })
        });
        const msgs = await response.json();
        setMessages(msgs.map(m => ({ type: m.sender, text: m.text })));
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
    }
  };

  const handleDetailSubmit = async () => {
    try {
      const userResp = await fetch('https://ticket-management-full-stack.onrender.com/tickets/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      const userData = await userResp.json();
      if (userData.previousChats) {
        const all = userData.previousChats.flatMap(t => t.messages);
        setMessages(all.map(m => ({ type: m.sender, text: m.text })));
      }
      setTicketId(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error in handleDetailSubmit:', error);
    }
  };

  return (
    <>
      {/* Tooltip */}
      {!open && showTooltip && (
        <div className="chat-tooltip">
          <div className="tooltip-header">
            <div className="tooltip-avatar"><img src={avatar} alt="avatar" /></div>
            <button className="tooltip-close" onClick={() => setShowTooltip(false)}>×</button>
          </div>
          <div className="tooltip-body">
            <span style={{ fontSize: 'large' }}>{design.welcomeMessage}</span>
          </div>
        </div>
      )}

      {/* Chat icon */}
      {!open && (
        <div
          className="chat-icon"
          onClick={() => { setOpen(true); setShowTooltip(false); }}
        >
          <img src={icon} alt="Chat icon" />
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className="chat-window" style={{ backgroundColor: design.backgroundColor }}>
          <div
            className="chat-header"
            style={{
              backgroundColor: design.headerColor,
              color: design.headerColor === 'white' ? '#000' : '#fff'
            }}
          >
            <div className="header-avatar"><img src={avatar} alt="avatar" /></div>
            <div className="header-title">Hubly</div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              <img src={closeIcon} alt="Close" />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.type}`}>{m.text}</div>
            ))}
          </div>

          {showForm && (
            <div className="detail-form">
              <div className="form-title">Introduce Yourself</div>
              <label className="form-label">Your Name</label>
              <input
                className="form-input"
                placeholder={placeholders.name}
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <label className="form-label">Your Phone</label>
              <input
                className="form-input"
                placeholder={placeholders.phone}
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <label className="form-label">Your Email</label>
              <input
                className="form-input"
                placeholder={placeholders.email}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button className="detail-submit" onClick={handleDetailSubmit}>
                Thank You!
              </button>
            </div>
          )}

          <div className="chat-input-container">
            <textarea
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button className="send-button" onClick={handleSend}>
              <img src={send} alt="Send" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
