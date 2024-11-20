import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState('');
  const [message, setMessage] = useState(null);

  const fetchQueues = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/queues',);
      console.log(response.data);
      
      setQueues(response.data);
    } catch (error) {
      console.error('Error fetching queues:', error);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);


  const handleSelectQueue = (e) => {
    setSelectedQueue(e.target.value);
  };

  const handleGo = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/${selectedQueue}`);
      setMessage(response.data);
      fetchQueues(); // עדכון רשימת התורים
    } catch (error) {
      if (error.response && error.response.status === 204) {
        setMessage('No messages in queue.');
      } else {
        console.error('Error fetching message:', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Message Queues</h1>
      <ul>
  {Array.isArray(queues) && queues.map(queue => (
    <li key={queue.name}>
      {queue.name} - {queue.messageCount} messages
    </li>
  ))}
</ul>

      <div>
        <select value={selectedQueue} onChange={handleSelectQueue}>
          <option value="">Select a queue</option>
          {queues.map(queue => (
            <option key={queue.name} value={queue.name}>{queue.name}</option>
          ))}
        </select>
        <button onClick={handleGo}>Go</button>
      </div>

      {message && (
        <div>
          <h2>Message:</h2>
          <pre>{JSON.stringify(message, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
