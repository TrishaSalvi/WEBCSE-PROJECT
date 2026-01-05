import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../../../utilities/api";
import GlassCard from "../../../components/GlassCard";

export default function AddExpense() {
  const router = useRouter();
  const { id } = router.query;
  
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [splitType, setSplitType] = useState("equal");
  const [members, setMembers] = useState([]);
  const [customSplits, setCustomSplits] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGroupMembers();
    }
  }, [id]);

  const fetchGroupMembers = async () => {
    try {
      // We need to get group members - let's add a route for this
      // For now, we'll fetch from balances which includes all members
      const res = await api.get(`/expenses/balances/${id}`);
      const groupMembers = res.data.map(b => b.user);
      setMembers(groupMembers);
      
      // Initialize custom splits
      const initialSplits = {};
      groupMembers.forEach(member => {
        initialSplits[member._id] = 0;
      });
      setCustomSplits(initialSplits);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  const handleCustomSplitChange = (userId, value) => {
    setCustomSplits({
      ...customSplits,
      [userId]: parseFloat(value) || 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!description || !amount) {
        alert("Please fill all required fields");
        setLoading(false);
        return;
      }

      const expenseAmount = parseFloat(amount);

      // Prepare splits
      let splits = [];
      
      if (splitType === "custom") {
        const totalCustom = Object.values(customSplits).reduce((sum, val) => sum + val, 0);
        
        if (Math.abs(totalCustom - expenseAmount) > 0.01) {
          alert(`Custom splits (₹${totalCustom.toFixed(2)}) must equal total amount (₹${expenseAmount.toFixed(2)})`);
          setLoading(false);
          return;
        }
        
        splits = Object.entries(customSplits)
          .filter(([_, amt]) => amt > 0)
          .map(([userId, amt]) => ({
            user: userId,
            amount: parseFloat(amt)
          }));
      }

      await api.post("/expenses", {
        groupId: id,
        description,
        amount: expenseAmount,
        splitType,
        splits: splitType === "custom" ? splits : undefined,
        category
      });

      alert("Expense added successfully!");
      router.push(`/group/${id}`);
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Error adding expense");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["General", "Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"];

  return (
    <div className="page-bg">
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <button 
          onClick={() => router.push(`/group/${id}`)}
          style={{ 
            background: "rgba(255,255,255,0.1)", 
            color: "white",
            padding: "8px 16px",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          ← Back
        </button>

        <GlassCard>
          <form onSubmit={handleSubmit} className="form">
            <h2 className="title" style={{ marginBottom: "30px" }}>Add New Expense</h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "rgba(255,255,255,0.8)" }}>
                Description *
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this expense for?"
                required
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "white" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "rgba(255,255,255,0.8)" }}>
                Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "white" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "rgba(255,255,255,0.8)" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "white" }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ background: "#1a1a2e", color: "white" }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "rgba(255,255,255,0.8)" }}>
                Split Type
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setSplitType("equal")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: splitType === "equal" ? "#00eaff" : "rgba(255,255,255,0.1)",
                    color: splitType === "equal" ? "#000" : "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: splitType === "equal" ? "bold" : "normal"
                  }}
                >
                  Split Equally
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType("custom")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: splitType === "custom" ? "#00eaff" : "rgba(255,255,255,0.1)",
                    color: splitType === "custom" ? "#000" : "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: splitType === "custom" ? "bold" : "normal"
                  }}
                >
                  Custom Split
                </button>
              </div>
            </div>

            {splitType === "custom" && (
              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", marginBottom: "12px", color: "rgba(255,255,255,0.8)" }}>
                  Custom Splits (must total ₹{amount || "0.00"})
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {members.map(member => (
                    <div key={member._id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ flex: 1, fontSize: "0.9rem" }}>{member.name}</span>
                      <input
                        type="number"
                        step="0.01"
                        value={customSplits[member._id] || ""}
                        onChange={(e) => handleCustomSplitChange(member._id, e.target.value)}
                        placeholder="0.00"
                        style={{ 
                          width: "120px", 
                          padding: "8px 12px", 
                          borderRadius: "8px", 
                          border: "1px solid rgba(255,255,255,0.2)", 
                          background: "rgba(255,255,255,0.05)", 
                          color: "white" 
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: "10px", fontSize: "0.85rem", opacity: 0.6 }}>
                  Total: ₹{Object.values(customSplits).reduce((sum, val) => sum + val, 0).toFixed(2)}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "rgba(0,234,255,0.5)" : "#00eaff",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "1rem"
              }}
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}