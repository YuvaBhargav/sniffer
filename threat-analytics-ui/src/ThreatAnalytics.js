import React, { useState, useEffect } from 'react';
import './App.css';

const ThreatAnalytics = () => {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/threats');
        const data = await response.json();
        setThreats(data);
      } catch (error) {
        console.error('Error fetching threats:', error);
      }
    };

    fetchThreats();

    const eventSource = new EventSource('http://localhost:5000/api/threats/stream');
    eventSource.onmessage = (event) => {
      const newThreat = JSON.parse(event.data);
      setThreats((prevThreats) => [newThreat, ...prevThreats]);
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="container">
      <h1>Real-Time Threat Analytics Dashboard</h1>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Threat Type</th>
              <th>Source IP</th>
              <th>Destination IP</th>
              <th>Ports</th>
              <th>Protocol</th>
              <th>Severity</th>
              <th>Attack Vector</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {threats.map((threat, index) => (
              <tr key={index}>
                <td>{threat['Timestamp']}</td>
                <td>{threat['Threat Type']}</td>
                <td>{threat['Source IP']}</td>
                <td>{threat['Destination IP']}</td>
                <td>{threat['Ports']}</td>
                <td>{threat['Protocol'] || 'TCP'}</td>
                <td>{threat['Severity'] || 'Medium'}</td>
                <td>{threat['Attack Vector'] || 'Network'}</td>
                <td>{threat['Description'] || 'No details available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ThreatAnalytics;
