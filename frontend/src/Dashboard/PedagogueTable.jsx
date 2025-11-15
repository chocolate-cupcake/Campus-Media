import React, { useMemo } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import universities from './data.js';

/**
 * PedagogueTable
 * Shows top pedagogues (professors) ranked by rating.
 * Props:
 * - top (number) : how many top pedagogues to show (default 5)
 * - professors (array) : optional array of professor objects to use instead of collecting from data.js
 */
function PedagogueTable({ top = 5, professors, onReview, onDeleteReview, reviewedIds = new Set(), userReviewedIds = new Set(), canReview = () => true }) {
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

  const renderActions = (p) => {
    // normalize sets to support either Set or plain object
    const userHas = userReviewedIds && typeof userReviewedIds.has === 'function' && userReviewedIds.has(p.id);
    const someoneHas = reviewedIds && typeof reviewedIds.has === 'function' && reviewedIds.has(p.id);

    if (userHas) {
      return (
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-secondary" onClick={() => (onReview ? onReview(p) : console.log('Edit', p))}>
            Edit
          </Button>
          <Button size="sm" variant="outline-danger" onClick={() => (onDeleteReview ? onDeleteReview(p) : console.log('Delete', p))}>
            Delete
          </Button>
        </div>
      );
    }

    if (someoneHas) {
      return <Button size="sm" variant="outline-secondary" disabled>Viewed</Button>;
    }

    if (canReview(p)) {
      return <Button size="sm" variant="outline-primary" onClick={() => (onReview ? onReview(p) : console.log('Review', p))}>Review</Button>;
    }

    return <Button size="sm" variant="outline-secondary" disabled>View</Button>;
  };

  return (
    <Table striped hover responsive className="mt-2 table-sm align-middle compact-table">
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>University</th>
          <th>Department</th>
          <th>Courses</th>
          <th>Rating</th>
          <th>Years</th>
          <th>Actions</th>
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
            <td>{renderActions(p)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default PedagogueTable;
