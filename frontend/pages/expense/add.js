import { useState } from "react";
import GlassCard from "../../components/GlassCard";

export default function AddExpense() {
  const [groupId, setGroupId] = useState("");
  const [amount, setAmount] = useState("");
  const [participants, setParticipants] = useState("");
  const [description, setDescription] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-bg">
      <GlassCard>
        <h2 className="title">Add Expense</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            placeholder="Group ID"
          />

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />

          <input
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="Participants"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
          >
            <option value="equal">Equal</option>
            <option value="exact">Exact</option>
            <option value="percent">Percent</option>
          </select>

          <button type="submit">Add</button>

          {err && <p className="error">{err}</p>}
        </form>
      </GlassCard>
    </div>
  );
}