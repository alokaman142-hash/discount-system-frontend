import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [discounts, setDiscounts] = useState([]);
  const [orderValue, setOrderValue] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [eligibility, setEligibility] = useState(null);
  const [applied, setApplied] = useState(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/discounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiscounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkEligibility = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/discounts/check-eligibility`, {
        ruleId: selectedDiscount,
        orderValue: parseFloat(orderValue)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEligibility(res.data.eligible);
    } catch (err) {
      alert('Check failed');
    }
  };

  const applyDiscount = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/discounts/apply`, {
        ruleId: selectedDiscount,
        orderValue: parseFloat(orderValue)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplied(res.data);
    } catch (err) {
      alert('Application failed');
    }
  };

  return (
    <div>
      <h2>Customer Dashboard</h2>
      <h3>Available Discounts</h3>
      <ul>
        {discounts.map(d => (
          <li key={d._id}>{d.name} - {d.discountPercent}% off</li>
        ))}
      </ul>
      <h3>Check Eligibility</h3>
      <input type="number" placeholder="Order Value" value={orderValue} onChange={(e) => setOrderValue(e.target.value)} />
      <select value={selectedDiscount} onChange={(e) => setSelectedDiscount(e.target.value)}>
        <option value="">Select Discount</option>
        {discounts.map(d => (
          <option key={d._id} value={d._id}>{d.name}</option>
        ))}
      </select>
      <button onClick={checkEligibility}>Check Eligibility</button>
      {eligibility !== null && <p>Eligible: {eligibility ? 'Yes' : 'No'}</p>}
      {eligibility && <button onClick={applyDiscount}>Apply Discount</button>}
      {applied && (
        <div>
          <p>Discount Applied: {applied.discountAmount}</p>
          <p>Final Amount: {applied.finalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;