import React, { useState } from 'react';
import icon from '../Images/Floating Action Button.png';
import avatar from '../Images/Avatar.png';
import send from '../Images/Send.png';
import closeIcon from '../Images/FloatingCrossButton.png';
import '../Pages/ChatBotDesigning.css';

export default function ChatBotPreview({
  headerColor,
  backgroundColor,
  customMessages,
  introductionPlaceholders,
  welcomeMessage,
  missedChatTimer
}) {
  const [showTooltip, setShowTooltip] = useState(true);
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(true);

  return (
    <>
      {/* Tooltip */}
      {!open && showTooltip && (
        <div className="chat-tooltip-preview">
          <div className="tooltip-header">
            <div className="tooltip-avatar">
              <img src={avatar} alt="avatar" />
            </div>
            <button className="tooltip-close" onClick={() => setShowTooltip(false)}>x</button>
          </div>
          <div className="tooltip-body">
            <span style={{ fontSize: 'large' }}>{welcomeMessage}</span>
          </div>
        </div>
      )}

      {/* Chat icon */}
      {!open && (
        <div className="chat-icon-preview" onClick={() => { setOpen(true); setShowTooltip(false); }}>
          <img src={icon} alt="Chat icon" />
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className="chat-window-preview" style={{ backgroundColor }}>
          <div className="chat-header" style={{ backgroundColor: headerColor, color: headerColor === 'white' ? '#000' : '#fff' }}>
            <div className="header-avatar">
              <img src={avatar} alt="avatar" />
            </div>
            <div className="header-title">Hubly</div>
            <button className="chat-close-preview" onClick={() => setOpen(false)} style={{backgroundColor:"transparent"}} >
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
          <div className="chat-messages">
            {customMessages.map((text, idx) => (
              <div key={idx} className="message bot">{text}</div>
            ))}
          </div>
          {showForm && (
            <div className="detail-form">
              <div className="form-title">Introduce Yourself</div>
              <label className="form-label">Your Name</label>
              <input
                className="form-input"
                placeholder={introductionPlaceholders.name}
                disabled
              />
              <label className="form-label">Your Phone</label>
              <input
                className="form-input"
                placeholder={introductionPlaceholders.phone}
                disabled
              />
              <label className="form-label">Your Email</label>
              <input
                className="form-input"
                placeholder={introductionPlaceholders.email}
                disabled
              />
              <button className="detail-submit">Thank You!</button>
            </div>
          )}
          <div className="missed-chat-timer" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderTop: '1px solid #eee' }}>
            Missed chat timer: {missedChatTimer}
          </div>
          <div className="chat-input-container">
            <textarea
              className="chat-input"
              placeholder="Type a message..."
              disabled
            />
            <button className="send-button" disabled>
              <img src={send} alt="Send" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}