import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import img from '../Images/img.png'
import './Dashboard.css';

export default function Dashboard() {
  const { userId } = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleOpenTicket = () => {
    navigate(`/member/contact-center`);
  }

  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

  const fetchTickets = async () => {
    let url;
    if (activeTab === 'all') {
      url = `http://localhost:5000/tickets/${userId}`;
    } else {
      const statusParam = activeTab === 'resolved' ? 'resolved' : 'open';
      url = `http://localhost:5000/tickets/${userId}/status/${statusParam}`;
    }
    const res = await fetch(url, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include' 
    });
    const data = await res.json();
    setTickets(data);
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).valueOf();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="dash-container">
      <div className="dash-header">
        <h1>Dashboard</h1>
        <input
          type="text"
          placeholder="Search for ticket"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="dash-tabs">
        {['all', 'resolved', 'unresolved'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'All Tickets' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <ul className="ticket-list">
        {tickets
          .filter(t => t._id.includes(searchTerm) || searchTerm === '')
          .map(ticket => (
            <li key={ticket._id} className="ticket-item">
              <div className="ticket-main">
                <div
                  className="ticket-dot"
                  style={{ backgroundColor: ticket.status === 'resolved' ? 'green' : '#ffc107' }}
                />
                <div>
                  <div className="ticket-id">Ticket# {ticket._id.slice(-6)}</div>
                  <div className="ticket-msg">{ticket.messages[0]?.text}</div>
                </div>
                <div className="ticket-time">
                  <div className="posted-at">Posted at {formatTime(ticket.createdAt)}</div>
                  <div className="ago">{timeAgo(ticket.createdAt)}</div>
                </div>
                <button
                  className="open-link"
                  onClick={handleOpenTicket}
                  style={{ backgroundColor: 'none', outline: 'none' }}
                >
                  Open Ticket
                </button>
              </div>
              <TicketUser id={ticket.raisedBy} />
            </li>
          ))}
      </ul>
    </div>
  );
}

// Subcomponent to fetch and display bot user info
function TicketUser({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/tickets/botuser/${id}`, {  
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include' 
    })
      .then(res => res.json())
      .then(setUser);
  }, [id]);

  if (!user) return null;
  return (
    <div className="ticket-user">
      <img src={img} alt="avatar" className="user-avatar" />
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-contact">{user.phone}</div>
        <div className="user-contact">{user.email}</div>
      </div>
    </div>
  );
}