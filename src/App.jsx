import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Card from './components/Card';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import './App.css';

const App = () => {
  const [count, setCount] = useState(0);

  // Run once on mount
  useEffect(() => {
    console.log("App Loaded");
  }, []);

  // Run on state change
  useEffect(() => {
    console.log("State updated");
  }, [count]);

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        
        <section className="demo-section counter-section">
          <h2>Counter Demo</h2>
          <p>Current Count: {count}</p>
          <button onClick={() => setCount(count + 1)} className="btn-primary">
            Add Expense Count
          </button>
        </section>

        <section className="cards-section">
          <Card title="Food Expense" description="Track your daily food and dining spending." />
          <Card title="Travel Expense" description="Monitor your transportation and flight costs." />
          <Card title="Utilities" description="Manage your monthly bills like electricity and water." />
        </section>

        <section className="forms-section">
          <div className="form-wrapper">
            <LoginForm />
          </div>
          <div className="form-wrapper">
            <RegisterForm />
          </div>
        </section>

      </div>
    </>
  );
};

export default App;
