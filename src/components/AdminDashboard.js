import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [rules, setRules] = useState([]);
  const [usages, setUsages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [conditions, setConditions] = useState([{ type: 'minOrderValue', value: '' }]);

  useEffect(() => {
    fetchRules();
    fetchUsages();
  }, []);

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/discounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/discounts/usage', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addCondition = () => {
    setConditions([...conditions, { type: 'minOrderValue', value: '' }]);
  };

  const updateCondition = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const createRule = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/discounts', {
        name,
        description,
        discountPercent: parseFloat(discountPercent),
        conditions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRules();
      setName('');
      setDescription('');
      setDiscountPercent('');
      setConditions([{ type: 'minOrderValue', value: '' }]);
    } catch (err) {
      alert('Failed to create rule');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Create Discount Rule</h3>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="number" placeholder="Discount %" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
      {conditions.map((cond, index) => (
        <div key={index}>
          <select value={cond.type} onChange={(e) => updateCondition(index, 'type', e.target.value)}>
            <option value="minOrderValue">Min Order Value</option>
            <option value="userCategory">User Category</option>
            <option value="usageLimit">Usage Limit</option>
          </select>
          <input type={cond.type === 'minOrderValue' || cond.type === 'usageLimit' ? 'number' : 'text'} placeholder="Value" value={cond.value} onChange={(e) => updateCondition(index, 'value', e.target.value)} />
        </div>
      ))}
      <button onClick={addCondition}>Add Condition</button>
      <button onClick={createRule}>Create Rule</button>

      <h3>Existing Rules</h3>
      <ul>
        {rules.map(r => (
          <li key={r._id}>{r.name} - {r.discountPercent}%</li>
        ))}
      </ul>

      <h3>Usage Reports</h3>
      <ul>
        {usages.map(u => (
          <li key={u._id}>{u.userId.username} - {u.discountRuleId.name} - Applied: {u.applied ? 'Yes' : 'No'}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;