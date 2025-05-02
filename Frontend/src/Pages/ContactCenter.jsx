import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../UserContext";
import send from "../Images/Group 22.png"
import dashboard from "../Images/dashboard.png"
import user from "../Images/user.png"
import phone from "../Images/phone.png"
import email from "../Images/email.png"
import './ContactCenter.css';

export default function ContactCenter() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch current user, tickets, and team members
  useEffect(() => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    const init = async () => {
      try {
        // Fetch user details
        const userRes = await fetch(`http://localhost:5000/users/getUserDetails/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user details.");
        }

        const { user } = await userRes.json(); // Destructure the nested user object

        // Fetch tickets
        const ticketsRes = await fetch(`http://localhost:5000/tickets/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!ticketsRes.ok) {
          throw new Error("Failed to fetch tickets.");
        }
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData);

        // Fetch team members
        if (user.teamId) {
          const teamRes = await fetch(`http://localhost:5000/team/getTeamMembers/${user.teamId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (!teamRes.ok) {
            throw new Error("Failed to fetch team members.");
          }

          const teamData = await teamRes.json();
          setTeamMembers(teamData);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };

    init();
  }, [userId]);

  // Fetch messages when a ticket is selected
  useEffect(() => {
    if (!selectedTicket) return;

    const fetchMessages = async () => {
      try {
        const msgsRes = await fetch(`http://localhost:5000/tickets/${selectedTicket._id}/messages`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!msgsRes.ok) {
          throw new Error("Failed to fetch messages.");
        }

        const msgs = await msgsRes.json();
        setMessages(msgs);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchMessages();
  }, [selectedTicket]);

  useEffect(() => {
    if (!selectedTicket) return;

    const fetchUserDetails = async () => {
      try {
        const userRes = await fetch(`http://localhost:5000/tickets/botuser/${selectedTicket.raisedBy}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user details.");
        }

        const user = await userRes.json();
        setUserDetails(user);
      } catch (err) {
        console.error("Fetch user details error:", err);
      }
    };

    fetchUserDetails();
  }, [selectedTicket]);

  // Assign ticket to teammate
  const handleAssign = async (e) => {
    const memberId = e.target.value;
    try {
        const res = await fetch(`http://localhost:5000/tickets/${selectedTicket._id}/assign`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            credentials: 'include',
            body: JSON.stringify({ assignedId: memberId })
        });
        const { ticket } = await res.json();
        setSelectedTicket(ticket);
        setTickets(tickets.map(t => t._id === ticket._id ? ticket : t));
    } catch (err) {
        console.error('Assign error:', err);
    }
};

  // Change status of ticket
  const handleStatusChange = async (e) => {
    const status = e.target.value;
    try {
      const res = await fetch(`http://localhost:5000/tickets/${selectedTicket._id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      const { ticket } = await res.json();
      setSelectedTicket(ticket);
    } catch (err) {
      console.error('Status change error:', err);
    }
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    try {
      const res = await fetch(`http://localhost:5000/tickets/${selectedTicket._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sender: 'bot', text: newMessage })
      });
      const msgs = await res.json();
      setMessages(msgs);
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    }
  };
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  // Inject date separators
  const renderMessages = () => {
    let lastDate = '';
    return messages.flatMap((msg, idx) => {
      const date = formatDate(msg.timestamp);
      const parts = [];
      if (date !== lastDate) {
        parts.push(
          <div key={`sep-${idx}`} className="date-separator">
            <span>{date}</span>
          </div>
        );
        lastDate = date;
      }
      parts.push(
        <div key={`msg-${idx}`} className={`message ${msg.sender}`}>
          <div className="message-text">{msg.text}</div>
        </div>
      );
      return parts;
    });
  };

  return (
    <div className="cc-container">
      {/* Section 1: Chat List */}
      <aside className="cc-chat-list">
        <h2>Chats</h2>
        <ul>
          {tickets.map(ticket => (
            <li key={ticket._id}
                className={`chat-item ${selectedTicket?._id === ticket._id ? 'active' : ''}`}
                onClick={() => setSelectedTicket(ticket)}>
              <div>#{ticket._id.slice(-6)}</div>
              <div className="status-text">{ticket.status}</div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Section 2: Chat Window */}
        <section className="cc-chat-window">
        <header className="chat-header">
          {selectedTicket ? (
            <>
              <span>Ticket #{selectedTicket._id.slice(-6)}</span>
              <button className="dashboard-button" onClick={() => navigate('/member/dashboard')}style={{backgroundColor: 'transparent', border: 'none'}}>
                <img src={dashboard} alt="Dashboard" className="dashboard-icon" style={{marginBottom:'1rem'}} />
              </button>
            </>
          ) : (
            <span>Select a chat to view</span>
          )}
        </header>

        <div className="chat-messages">
          {selectedTicket ? renderMessages() : <div className="empty-placeholder">No chat selected</div>}
        </div>

        {selectedTicket && (
          selectedTicket.status === 'resolved' ? (
            <div className="resolved-banner">This chat has been resolved.</div>
          ) : (
            <div className="chat-input-area">
              <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
                rows={2}
              />
              <button onClick={handleSendMessage}>
                <img src={send} alt="Send" className="send-icon" />
              </button>
            </div>
          )
        )}
      </section>

      {/* Section 3: Details Panel */}
      <aside className="cc-details-panel">
        {selectedTicket && (
          <>
            <div className="detail-item">
              <img src={user} alt="user" className="detail-icon" />
              <span className="detail-text">{userDetails.name}</span>
              <span className="badge">{messages.length}</span>
            </div>
            <div className="detail-item">
              <img src={phone} alt="phone" className="detail-icon" />
              <span className="detail-text">{userDetails.phone}</span>
            </div>
            <div className="detail-item">
              <img src={email} alt="email" className="detail-icon" />
              <span className="detail-text">{userDetails.email}</span>
            </div>

            <div className="detail-group">
              <label htmlFor="assignSelect">Teammates</label>
              <select id="assignSelect" value={selectedTicket.assignedTo} onChange={handleAssign}>
                {teamMembers.map(m => (
                  <option key={m.userId._id} value={m.userId._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="detail-group">
              <label htmlFor="statusSelect">Ticket status</label>
              <select id="statusSelect" value={selectedTicket.status} onChange={handleStatusChange}>
                <option value="open">Unresolved</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}