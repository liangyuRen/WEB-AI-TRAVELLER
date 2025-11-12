import React, { useState } from 'react';
import { budgetService } from '../services/api';

export default function BudgetManager() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [totalBudget, setTotalBudget] = useState(10000);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const newExpense = {
      id: Date.now().toString(),
      category,
      amount: parseFloat(amount),
      description,
      date: new Date().toLocaleDateString(),
    };

    setExpenses([...expenses, newExpense]);
    setAmount('');
    setDescription('');
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;

  const categoryTotals = expenses.reduce((acc: any, exp: any) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Budget Manager</h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Budget</p>
            <p className="text-3xl font-bold text-blue-600">¥{totalBudget}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Spent</p>
            <p className="text-3xl font-bold text-red-600">¥{totalSpent}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Remaining</p>
            <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ¥{remaining}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="accommodation">Accommodation</option>
                  <option value="food">Food</option>
                  <option value="transportation">Transportation</option>
                  <option value="activities">Activities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Amount (¥)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Hotel booking"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                Add Expense
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Breakdown by Category</h2>
            <div className="space-y-3">
              {Object.entries(categoryTotals).map(([cat, total]: any) => (
                <div key={cat} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">{cat}</span>
                  <span className="font-semibold text-gray-900">¥{total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
          <div className="space-y-2">
            {expenses.map((exp) => (
              <div key={exp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold capitalize">{exp.category}</p>
                  <p className="text-sm text-gray-600">{exp.description} - {exp.date}</p>
                </div>
                <span className="text-lg font-bold">¥{exp.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
