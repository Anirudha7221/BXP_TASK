import React, { useState, useEffect } from 'react';
import "./App.css";

const App = () => {
  const [data ,setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    // Fetch data from JSON file
    fetch('https://dummyjson.com/products')
      .then(response => response.json())
      .then(responseData => {
        // Check if responseData is an array
        if (Array.isArray(responseData)) {
          setData(responseData);
        } else if (typeof responseData === 'object') {
          // If responseData is an object, check for array data inside
          const dataArray = Object.values(responseData);
          if (Array.isArray(dataArray)) {
            setData(dataArray);
          } else {
            console.error('Data is not an array:', responseData);
          }
        } else {
          console.error('Invalid data format:', responseData);
        }
      })
      .catch(error => console.error(error));
  },[]); 

  const toggleRows = (id) => {
    setSelectedRows(prevSelectedRows => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter(rowId => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  return (
    <div id='containeer'>
        <table>
          <thead id='header'>
            <tr>
              <th>ID</th>
              <th>Mobile Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
        {data.map((row, index) => (
          <React.Fragment key={index}>
            <tr className={selectedRows.includes(row.id) ? 'selected' : ''} onClick={() => toggleRows(row.id)}>
              <td>{row.id}</td>
              <td>{row.title}</td>
              <td>{row.price}</td>
            </tr>
            {selectedRows.includes(row.id) && row.children && row.children.map((child, idx) => (
              <tr key={`${index}-${idx}`}>
                <td colSpan="3">{child.title}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
        </table>
    </div>
  );
};

export default App;
