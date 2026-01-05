import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../../utilities/api";
import GlassCard from "../../components/GlassCard";

export default function CreateGroup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [createdGroupId, setCreatedGroupId] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/groups", { name, description });
      setCreatedGroupId(res.data._id);
      alert("Group Created! Now you can invite members below.");
    } catch (err) {
      alert("Error creating group");
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post("/groups/invite", { groupId: createdGroupId, email: inviteEmail });
      alert("Member Invited!");
      setInviteEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Invite failed");
    }
  };

  return (
    <div className="page-bg">
      <GlassCard>
        {!createdGroupId ? (
          <form onSubmit={handleCreate} className="form">
            <h2 className="title">New Expense Group</h2>
            <input type="text" placeholder="Group Name" onChange={(e)=>setName(e.target.value)} required />
            <input type="text" placeholder="Description" onChange={(e)=>setDescription(e.target.value)} />
            <button type="submit">Create Group</button>
          </form>
        ) : (
          <form onSubmit={handleInvite} className="form">
            <h2 className="title">Invite to {name}</h2>
            <input type="email" placeholder="Member Email" value={inviteEmail} onChange={(e)=>setInviteEmail(e.target.value)} required />
            <button type="submit">Add Member</button>
            <button type="button" onClick={() => router.push("/dashboard")} style={{background: 'none'}}>Done</button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}