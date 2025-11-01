import React, { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import universities from './data.js';

/**
 * PedagogueTable
 * Shows top pedagogues (professors) ranked by rating.
 * Props:
 * - top (number) : how many top pedagogues to show (default 5)
 * - professors (array) : optional array of professor objects to use instead of collecting from data.js
 */
function PedagogueTable({ top = 5, professors }) {
  const allProfessors = useMemo(() => {
    if (Array.isArray(professors)) return professors;

    const list = [];
    universities.forEach((uni) => {
      (uni.departments || []).forEach((dept) => {
        (dept.professors || []).forEach((p) => {
          list.push({
            ...p,
            university: uni.name,
            department: dept.name,
          });
        });
      });
    });

    return list;
  }, [professors]);

  const sorted = useMemo(() => {
    return [...allProfessors]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, top);
  }, [allProfessors, top]);

  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>University</th>
          <th>Department</th>
          <th>Courses</th>
          <th>Rating</th>
          <th>Years</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((p, index) => (
          <tr key={p.id || `${p.name}-${index}`}>
            <td>{index + 1}</td>
            <td>{p.name} {p.surname}</td>
            <td>{p.university}</td>
            <td>{p.department}</td>
            <td>{(p.courses || []).slice(0, 3).join(', ')}</td>
            <td>{p.rating ?? '—'}</td>
            <td>{p.yearsOfExperience ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default PedagogueTable;
