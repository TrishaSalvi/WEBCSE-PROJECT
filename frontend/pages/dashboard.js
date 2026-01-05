import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../utilities/api"; // Your custom axios instance
import GlassCard from "../components/GlassCard";

export default function Dashboard() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      // 1. Check for token immediately
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 2. Fetch Groups using the protected 'api' instance
        // This automatically attaches the Bearer token from your interceptor
        const res = await api.get("/groups");
        setGroups(res.data);
        
      } catch (err) {
        console.error("Dashboard Error:", err);
        
        // 3. If token is invalid/expired (401), kick to login
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        // 4. Stop the loading spinner regardless of outcome
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="page-bg">
      <div className="dashboard-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "30px",
          color: "white" 
        }}>
          <div>
            <h1 style={{ margin: 0 }}>NovaSync Dashboard</h1>
            <p style={{ opacity: 0.7 }}>Welcome back to your workspace</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              className="btn-secondary" 
              onClick={handleLogout}
              style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              Logout
            </button>
            <button 
              className="btn-primary" 
              onClick={() => router.push("/group/create")}
              style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}
            >
              + Create Group
            </button>
            <button
             onClick={() => router.push("/invites")}
              className="secondary-btn"
            >
              Invites
            </button> 
          </div>
        </div>

        <GlassCard>
          <h2 className="title" style={{ marginBottom: "20px" }}>Your Groups</h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Loading your workspace...</p>
            </div>
          ) : groups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", border: "2px dashed rgba(255,255,255,0.1)", borderRadius: "15px" }}>
              <p>You haven't joined or created any groups yet.</p>
              <button 
                onClick={() => router.push("/group/create")}
                style={{ marginTop: "15px", background: "none", color: "#00eaff", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Create your first group
              </button>
            </div>
          ) : (
            <div className="grid" style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
              gap: "20px" 
            }}>
              {groups.map((g) => (
                <div
                  key={g._id}
                  className="group-card"
                  onClick={() => router.push(`/group/${g._id}`)}
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    padding: "20px", 
                    borderRadius: "12px", 
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: "#00eaff" }}>{g.name}</h3>
                  <p style={{ fontSize: "0.9rem", opacity: 0.8, color: "white" }}>
                    {g.description || "No description provided."}
                  </p>
                  <div style={{ marginTop: "15px", fontSize: "0.8rem", color: "white", opacity: 0.6 }}>
                    Members: {g.members?.length || 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}