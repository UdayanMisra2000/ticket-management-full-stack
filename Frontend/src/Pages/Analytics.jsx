import React, { useEffect, useState, useContext } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  CircularProgressbar, buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { UserContext } from '../UserContext';
import './Analytics.css';

export default function Analytics() {
  const { userId } = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [missedData, setMissedData] = useState([]);
  const [avgReplySec, setAvgReplySec] = useState(0);
  const [resolvedPct, setResolvedPct] = useState(0);
  const [missedThreshold, setMissedThreshold] = useState(3600); // default 1h

  // Load threshold once
  useEffect(() => {
    fetch('https://ticket-management-full-stack.onrender.com/chatbot/design', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        // parse "HH:MM:SS" into seconds
        const [h, m, s] = data.missedChatTimer.split(':').map(Number);
        setMissedThreshold(h * 3600 + m * 60 + s);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`https://ticket-management-full-stack.onrender.com/tickets/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        calculateMetrics(data);
      });
  }, [userId, missedThreshold]);

  function calculateMetrics(data) {
    const weeks = Array(10).fill(0);
    let totalReplies = 0, totalDiff = 0;
    let resolvedCount = 0, totalChats = data.length;

    data.forEach(ticket => {
      const msgs = ticket.messages;
      for (let i = 0; i < msgs.length - 1; i++) {
        if (msgs[i].sender === 'user' && msgs[i + 1].sender === 'bot') {
          const diffSec =
            (new Date(msgs[i + 1].timestamp) - new Date(msgs[i].timestamp)) / 1000;
          totalReplies++;
          totalDiff += diffSec;
          if (diffSec > missedThreshold) {
            const ageWeeks = Math.min(
              9,
              Math.floor(
                (Date.now() - new Date(ticket.createdAt)) / (1000 * 60 * 60 * 24 * 7)
              )
            );
            weeks[ageWeeks]++;
          }
        }
      }
      if (ticket.status === 'resolved') resolvedCount++;
    });

    setMissedData(
      weeks.map((count, i) => ({ week: `Week ${i + 1}`, chats: count }))
    );
    setAvgReplySec(totalReplies ? Math.round(totalDiff / totalReplies) : 0);
    setResolvedPct(totalChats ? Math.round((resolvedCount / totalChats) * 100) : 0);
  }

  return (
    <div className="analytics-container">
      <h1>Analytics</h1>
      <section className="metric-section">
        <h2>Missed Chats</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={missedData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="chats" stroke="#00b300" dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="metric-section flex-section">
          <div className="metric-desc">
          <h2>Average Reply time</h2>
          <p>For highest customer satisfaction rates you should aim to reply to an incoming customer's message in 15 seconds or less. Quick responses will get you more conversations, help you earn customers trust and make more sales. </p>
          </div>
          <div className="metric-value">
          <div className="large-num">{avgReplySec} secs</div>
          </div>
      </section>

        <section className="metric-section flex-section">
          <div className="metric-desc">
          <h2>Resolved Tickets</h2>
          <p> A callback system on a website, as well as proactive invitations, help to attract even more customers. A separate round button for ordering a call with a small animation helps to motivate more customers to make calls. </p>
          </div>
          <div className="metric-value circular-chart">
            <CircularProgressbar
              value={resolvedPct}
              text={`${resolvedPct}%`}
              styles={buildStyles({ pathColor: '#00b300', textColor: '#00b300' })}
            />
          </div>
      </section>

      <section className="metric-section flex-section">
        <div className="metric-desc">
        <h2>Total Chats</h2>
        <p> This metric Shows the total number of chats for all Channels for the selected the selected period </p>
        </div>
        <div className="metric-value">
        <div className="large-num">{tickets.length} Chats</div>
        </div>
      </section>
    </div>
  );
}