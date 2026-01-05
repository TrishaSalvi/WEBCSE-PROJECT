import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../utilities/api";
import GlassCard from "../components/GlassCard";

export default function Invites() {
  const router = useRouter();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const res = await api.get("/groups/invites");
      setInvites(res.data);
    } catch (err) {
      console.error("Error fetching invites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (groupId) => {
    try {
      await api.post("/groups/invites/accept", { groupId });
      alert("Invite accepted!");
      fetchInvites(); // Refresh list
    } catch (err) {
      alert("Error accepting invite");
    }
  };

  return (
    <div className="page-bg">
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <button 
          onClick={() => router.push("/dashboard")}
          style={{ 
            marginBottom: "20px", 
            background: "rgba(255,255,255,0.1)", 
            color: "white",
            padding: "10px 20px",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          ← Back to Dashboard
        </button>

        <GlassCard>
          <h2 className="title" style={{ marginBottom: "20px" }}>Your Invites</h2>

          {loading ? (
            <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
          ) : invites.length === 0 ? (
            <p style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
              No pending invites
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {invites.map((group) => (
                <div
                  key={group._id}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "#00eaff" }}>
                      {group.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.7 }}>
                      Invited by: {group.createdBy?.name || group.createdBy?.email}
                    </p>
                    {group.description && (
                      <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", opacity: 0.6 }}>
                        {group.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAccept(group._id)}
                    style={{
                      background: "#00eaff",
                      color: "#000",
                      padding: "10px 25px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}