const connectDB = require('../lib/connectDB');
const { User, Group, Expense } = require('../models');

require('dotenv').config();

const run = async () => {
  await connectDB(process.env.MONGO_URI);

  await User.deleteMany({});
  await Group.deleteMany({});
  await Expense.deleteMany({});

  const [u1, u2, u3, u4] = await User.create([
    { name: 'Alice', email: 'alice@example.com', password: 'password1' },
    { name: 'Bob', email: 'bob@example.com', password: 'password2' },
    { name: 'Clara', email: 'clara@example.com', password: 'password3' },
    { name: 'Dave', email: 'dave@example.com', password: 'password4' },
  ]);

  const group = await Group.create({
    name: 'NovaSync Test Group',
    owner: u1._id,
    members: [
      { user: u1._id, role: 'owner' },
      { user: u2._id },
      { user: u3._id },
      { user: u4._id },
    ],
  });

  const expense1 = await Expense.create({
    group: group._id,
    amount: 400,
    payer: u1._id,
    participants: [
      { user: u1._id },
      { user: u2._id },
      { user: u3._id },
      { user: u4._id },
    ],
    splitType: 'equal',
    description: 'Dinner',
  });

  group.ledger.push(expense1._id);
  await group.save();

  console.log('Seed complete');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
