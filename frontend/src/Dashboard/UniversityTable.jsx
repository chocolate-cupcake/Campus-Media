 import React from 'react';
 import universities from "./data.js";
 
    import { Table } from 'react-bootstrap';

 function UniversityTable() {
  function calculateHierarchicalRankings(universities) {
      // Sort universities by their rating in descending order
      let sorted = [...universities].sort((a, b) => b.rating - a.rating);
      sorted = sorted.slice(0, 3);
      // Assign rankings based on the sorted order
      return sorted.map((uni, index) => ({ ...uni, rank: index + 1 }));
    }
  
    // data state: loadable/persisted full dataset (universities, departments, professors, programs)
    return (
    <Table striped bordered hover responsive className="mt-3">
    <thead className="table-dark" >
      <tr>
        <th>University</th>
        <th>Avg Rank</th>

      </tr>
    </thead>
    <tbody>
      {calculateHierarchicalRankings(universities).map((uni, index) => (
        <tr  key={uni.id}>
          <td>{uni.name}</td>
          <td>{index + 1}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);
}

export default UniversityTable;
   