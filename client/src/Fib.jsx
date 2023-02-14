import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Fib() {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  const fetchValues = async () => {
    const values = await axios.get('/api/values/current');
    setValues(values.data);
  };

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get('/api/values/all');
    setSeenIndexes(seenIndexes.data);
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ');
  };

  const renderValues = () => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }
    return entries;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post('/api/values', {
      index: index,
    });
    setIndex('');
    fetchValues();
    fetchIndexes();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='input'>Enter your index</label>
        <input value={index} type='text' id='input' onChange={(e) => setIndex(e.target.value)} />
        <button>Submit</button>
      </form>
      <h3>Indexes i have seen:</h3>
      {renderSeenIndexes()}
      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  );
}

export default Fib;
