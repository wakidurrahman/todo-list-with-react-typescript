// src/components/molecules/todo-filters/TodoFilters.tsx

import InputField from '@/components/atoms/input-field/InputField';
import SelectField from '@/components/atoms/select-field/SelectField';
import { FilterStatus, SortBy } from '@/types/todo.types';

type TodoFiltersProps = {
  searchQuery: string;
  sortBy: SortBy;
  filterStatus: FilterStatus;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortBy) => void;
  onFilterChange: (filter: FilterStatus) => void;
};

const TodoFilters = ({
  searchQuery,
  sortBy,
  filterStatus,
  onSearchChange,
  onSortChange,
  onFilterChange,
}: TodoFiltersProps) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-12">
            <InputField
              type="search"
              id="search-todos"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search todos"
            />
          </div>

          {/* Filter Controls */}
          <div className="col-md-6">
            <SelectField
              id="filter-status"
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
              aria-label="Filter todos by status"
              options={[
                { value: 'all', label: 'All Tasks' },
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
              ]}
            />
          </div>

          {/* Sort Controls */}
          <div className="col-md-6">
            <SelectField
              id="sort-todos"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortBy)}
              aria-label="Sort todos"
              options={[
                { value: 'dueDate', label: 'Sort by Due Date' },
                { value: 'priority', label: 'Sort by Priority' },
                { value: 'createdAt', label: 'Sort by Created Date' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoFilters;
