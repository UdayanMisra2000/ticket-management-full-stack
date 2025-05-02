import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatBotPreview from '../Components/ChatBotPreview';
import './ChatBotDesigning.css';

export default function ChatBotDesigning() {
  const [loading, setLoading] = useState(true);
  const [headerColor, setHeaderColor] = useState('#33475B');
  const [backgroundColor, setBackgroundColor] = useState('#FAFBFC');
  const [customMessages, setCustomMessages] = useState(['How can I help you?', 'Ask me anything!']);
  const [introductionPlaceholders, setIntroductionPlaceholders] = useState({
    name: 'Your name',
    phone: '+1 (000) 000-0000',
    email: 'example@gmail.com'
  });
  const [welcomeMessage, setWelcomeMessage] = useState('👋 Want to chat about Hubly? I’m here to help you find your way.');
  const [missedChatTimer, setMissedChatTimer] = useState('01:00:00');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchConfig() {
      try {
        // Fetch user details to check role
        const userId = localStorage.getItem('userId');
        const userRes = await fetch(`http://localhost:5000/users/getUserDetails/${userId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          credentials: 'include'
        });
        const userData = await userRes.json();

        if (userData.role === 'member') {
          toast.error('You are unauthorized');
          setLoading(false);
          return;
        }

        // Fetch chatbot configuration
        const res = await fetch('http://localhost:5000/chatbot/design', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          credentials: 'include'
        });
        const data = await res.json();
        setHeaderColor(data.headerColor);
        setBackgroundColor(data.backgroundColor);
        setCustomMessages(data.customMessages);
        setWelcomeMessage(data.welcomeMessage);
        setMissedChatTimer(data.missedChatTimer);
        if (data.introductionPlaceholders) {
          setIntroductionPlaceholders(data.introductionPlaceholders);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch chatbot configuration.');
      }
    }
    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      // Fetch user details to check role
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
      const userRes = await fetch(`http://localhost:5000/users/getUserDetails/${userId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        credentials: 'include'
      });
      const userData = await userRes.json();

      // Check if the user is unauthorized
      if (userData.role === 'member') {
        toast.error('You are unauthorized');
        return; // Stop further execution
      }

      // Prepare payload for saving chatbot configuration
      const payload = {
        headerColor,
        backgroundColor,
        customMessages,
        welcomeMessage,
        missedChatTimer,
        introductionPlaceholders
      };

      // Save chatbot configuration
      const saveRes = await fetch('http://localhost:5000/chatbot/design', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (saveRes.ok) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('You are unauthorized!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving settings.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="design-container">
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <div className="preview-panel">
        <ChatBotPreview
          headerColor={headerColor}
          backgroundColor={backgroundColor}
          customMessages={customMessages}
          introductionPlaceholders={introductionPlaceholders}
          welcomeMessage={welcomeMessage}
          missedChatTimer={missedChatTimer}
        />
      </div>

      <div className="settings-panel">
        {/* Settings sections remain unchanged */}
        <section className="setting-section">
          <h3>Header Color</h3>
          <div className="color-options">
            {['white', 'black', '#33475B'].map(color => (
              <label
                key={color}
                className="color-circle"
                style={{
                  backgroundColor: color,
                  border: "1px solid rgba(0, 0, 0, 0.18)", 
                  borderRadius: "50%", 
                  padding: "5px", 
                }}
              >
                <input
                  type="radio"
                  name="headerColor"
                  value={color}
                  checked={headerColor === color}
                  onChange={() => setHeaderColor(color)}
                  style={{ display: "none" }}
                />
              </label>
            ))}
          </div>
          <div className="color-code"><input value={headerColor} onChange={e => setHeaderColor(e.target.value)} /></div>
        </section>

        <section className="setting-section">
          <h3>Custom Background Color</h3>
          <div className="color-options">
            {['white', 'black', '#FAFBFC'].map(color => (
              <label key={color} className="color-circle" style={{ 
                backgroundColor: color,
                border: "1px solid rgba(0, 0, 0, 0.18)", 
                }}>
                <input
                  type="radio"
                  name="backgroundColor"
                  value={color}
                  checked={backgroundColor === color}
                  onChange={() => setBackgroundColor(color)}
                />
              </label>
            ))}
          </div>
          <div className="color-code"><input value={backgroundColor} onChange={e => setBackgroundColor(e.target.value)} /></div>
        </section>

        <section className="setting-section">
          <h3>Customize Message</h3>
          {customMessages.map((msg, idx) => (
            <input
              key={idx}
              value={msg}
              onChange={e => {
                const arr = [...customMessages]; arr[idx] = e.target.value; setCustomMessages(arr);
              }}
            />
          ))}
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide Form' : 'Add New Message'}
          </button>
          {showForm && (
            <div>
              <input
                placeholder="Enter new message"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setCustomMessages([...customMessages, e.target.value]);
                    e.target.value = '';
                    setShowForm(false);
                  }
                }}
              />
            </div>
          )}
        </section>

        <section className="setting-section">
          <h3>Introduction Form</h3>
          <label>Your name</label>
          <input
            value={introductionPlaceholders.name}
            onChange={e => setIntroductionPlaceholders(prev => ({ ...prev, name: e.target.value }))}
          />
          <label>Your phone</label>
          <input
            value={introductionPlaceholders.phone}
            onChange={e => setIntroductionPlaceholders(prev => ({ ...prev, phone: e.target.value }))}
          />
          <label>Your email</label>
          <input
            value={introductionPlaceholders.email}
            onChange={e => setIntroductionPlaceholders(prev => ({ ...prev, email: e.target.value }))}
          />
        </section>

        <section className="setting-section">
          <h3>Welcome Message</h3>
          <textarea
            rows={3}
            value={welcomeMessage}
            onChange={e => setWelcomeMessage(e.target.value)}
          />
        </section>

        <section className="setting-section">
          <h3>Missed chat timer</h3>
          <input
            type="text"
            pattern="\\d{2}:\\d{2}:\\d{2}"
            value={missedChatTimer}
            onChange={e => setMissedChatTimer(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </section>
      </div>
    </div>
  );
}