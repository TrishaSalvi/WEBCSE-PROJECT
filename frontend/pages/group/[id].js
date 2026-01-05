import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../utilities/api";
import GlassCard from "../../components/GlassCard";

export default function GroupDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [activeTab, setActiveTab] = useState("expenses");
  const [loading, setLoading] = useState(true);
  const [processingSettlement, setProcessingSettlement] = useState(null);

  useEffect(() => {
    if (id) {
      fetchGroupData();
    }
  }, [id]);

  const fetchGroupData = async () => {
    try {
      const [expensesRes, balancesRes, settlementsRes] = await Promise.all([
        api.get(`/expenses/group/${id}`),
        api.get(`/expenses/balances/${id}`),
        api.get(`/expenses/settlements/${id}`)
      ]);
      
      setExpenses(expensesRes.data);
      setBalances(balancesRes.data);
      setSettlements(settlementsRes.data);
    } catch (err) {
      console.error("Error fetching group data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = async (toUserId, amount, index) => {
    if (!window.confirm(`Record settlement of ₹${amount.toFixed(2)}?`)) return;
    
    setProcessingSettlement(index);
    
    try {
      await api.post("/expenses/settle", {
        groupId: id,
        toUserId,
        amount
      });
      alert("Settlement recorded!");
      await fetchGroupData();
    } catch (err) {
      alert("Error recording settlement");
    } finally {
      setProcessingSettlement(null);
    }
  };

  if (loading) {
    return (
      <div className="page-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ color: "white" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <button 
              onClick={() => router.push("/dashboard")}
              style={{ 
                background: "rgba(255,255,255,0.1)", 
                color: "white",
                padding: "8px 16px",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              ← Back
            </button>
            <h1 style={{ color: "white", margin: "10px 0 5px 0" }}>Group Expenses</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>Manage and track expenses</p>
          </div>
          <button 
            onClick={() => router.push(`/group/${id}/add-expense`)}
            style={{
              background: "#00eaff",
              color: "#000",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            + Add Expense
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {["expenses", "balances", "settle"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                background: activeTab === tab ? "#00eaff" : "rgba(255,255,255,0.1)",
                color: activeTab === tab ? "#000" : "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                textTransform: "capitalize",
                fontWeight: activeTab === tab ? "bold" : "normal"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <GlassCard>
          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>All Expenses</h2>
              {expenses.length === 0 ? (
                <p style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
                  No expenses yet. Add your first expense!
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {expenses.map(expense => (
                    <div
                      key={expense._id}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        padding: "20px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <div>
                          <h3 style={{ margin: "0 0 5px 0", color: "#00eaff" }}>
                            {expense.description}
                          </h3>
                          <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.7 }}>
                            Paid by {expense.paidBy.name} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#00eaff" }}>
                            ₹{expense.amount.toFixed(2)}
                          </p>
                          <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
                            {expense.splitType === "equal" ? "Split Equally" : "Custom Split"}
                          </p>
                        </div>
                      </div>
                      <div style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "10px" }}>
                        Split among: {expense.splits.map(s => s.user.name).join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Balances Tab */}
          {activeTab === "balances" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>Member Balances</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {balances.map(balance => (
                  <div
                    key={balance.user._id}
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
                      <h3 style={{ margin: "0 0 5px 0" }}>{balance.user.name}</h3>
                      <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.6 }}>
                        {balance.user.email}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: "1.3rem", 
                        fontWeight: "bold",
                        color: balance.balance > 0 ? "#00ff88" : balance.balance < 0 ? "#ff4444" : "#888"
                      }}>
                        {balance.balance > 0 ? "+" : ""}₹{Math.abs(balance.balance).toFixed(2)}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
                        {balance.balance > 0 ? "Gets back" : balance.balance < 0 ? "Owes" : "Settled"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settle Tab */}
          {activeTab === "settle" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>Settlement Suggestions</h2>
              {settlements.length === 0 ? (
                <p style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
                  All settled up! 🎉
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {settlements.map((settlement, index) => (
                    <div
                      key={index}
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
                          {settlement.from.name} → {settlement.to.name}
                        </h3>
                        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.6 }}>
                          {settlement.from.email}
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: "bold", color: "#00eaff" }}>
                          ₹{settlement.amount.toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleSettle(settlement.to._id, settlement.amount, index)}
                          disabled={processingSettlement === index}
                          style={{
                            background: processingSettlement === index ? "#666" : "#00ff88",
                            color: processingSettlement === index ? "#ccc" : "#000",
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: processingSettlement === index ? "not-allowed" : "pointer",
                            fontWeight: "bold"
                          }}
                        >
                          {processingSettlement === index ? "Processing..." : "Record Payment"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}