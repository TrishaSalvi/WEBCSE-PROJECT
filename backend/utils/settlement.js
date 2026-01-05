/**
 * Settlement Algorithm
 * Input: balances object { userId: number }
 * Output: array of settlements { from, to, amount }
 */
function calculateSettlement(balances) {
  const creditors = [];
  const debtors = [];

  // Separate creditors and debtors
  for (const userId in balances) {
    const amount = balances[userId];

    if (amount > 0) {
      creditors.push({ userId, amount });
    } else if (amount < 0) {
      debtors.push({ userId, amount: -amount });
    }
  }

  const settlements = [];
  let i = 0;
  let j = 0;

  // Greedy matching
  while (i < debtors.length && j < creditors.length) {
    const payAmount = Math.min(debtors[i].amount, creditors[j].amount);

    settlements.push({
      from: debtors[i].userId,
      to: creditors[j].userId,
      amount: payAmount
    });

    debtors[i].amount -= payAmount;
    creditors[j].amount -= payAmount;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return settlements;
}

module.exports = calculateSettlement;
