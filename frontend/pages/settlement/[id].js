// pages/settlement/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from '../../utils/api';
import GlassCard from '../../components/GlassCard';

export default function SettlementPage() {
  const router = useRouter();
  const { id } = router.query;
  const [plan,setPlan]=useState(null);

  useEffect(()=> {
    if(!id) return;
    const fetch = async ()=> {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/groups/${id}/settlement`, { headers: { Authorization: 'Bearer ' + token }});
        setPlan(res.data.plan || res.data);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, [id]);

    return (
  <div className="page-bg">
    <GlassCard>
      <h2 className="title">{group?.name}</h2>
      <p>{group?.description}</p>

      <h3>Members</h3>
      <ul>
        {group?.members?.map((m, i) => (
          <li key={i}>{m.user}</li>
        ))}
      </ul>

      <h3>Ledger</h3>
      <ul>
        {group?.ledger?.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>

      <h3>Chat</h3>
      <div className="chat-box">
        {chat.map((c, i) => (
          <div key={i} className="chat-line">
            <b>User:</b> {c.message}
            <span className="time">{new Date(c.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 8 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message"
        />
        <button onClick={postMessage}>Send</button>
      </div>
    </GlassCard>
  </div>
);
}
