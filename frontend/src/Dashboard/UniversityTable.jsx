 import React from 'react';
 
    import { Table } from 'react-bootstrap';

 function UniversityTable({ universities }) {
    return (
    <Table striped bordered hover responsive className="mt-3">
    <thead className="table-dark" >
      <tr>
        <th>University</th>
        <th>Avg Rank</th>

      </tr>
    </thead>
    <tbody>
      {universities.map((uni, index) => (
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
   