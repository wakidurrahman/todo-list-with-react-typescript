// src/components/molecules/todo-filters/TodoFilters.tsx
import React from 'react';

import { FilterStatus, SortBy } from '@/types/todo.types';

type TodoFiltersProps = {
  searchQuery: string;
  sortBy: SortBy;
  filterStatus: FilterStatus;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortBy) => void;
  onFilterChange: (filter: FilterStatus) => void;
};

const TodoFilters: React.FC<TodoFiltersProps> = ({
  searchQuery,
  sortBy,
  filterStatus,
  onSearchChange,
  onSortChange,
  onFilterChange,
}) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-12">
            <input
              type="search"
              className="form-control"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search todos"
            />
          </div>

          {/* Filter Controls */}
          <div className="col-md-6">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
              aria-label="Filter todos by status"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Sort Controls */}
          <div className="col-md-6">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortBy)}
              aria-label="Sort todos"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="createdAt">Sort by Created Date</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoFilters;
