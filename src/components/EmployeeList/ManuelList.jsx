import React, { useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { EmployeeContext } from '../../utils/EmployeeContext';
import { useSearch } from '../../utils/useSearch';
import './manuallist.css';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'firstName', numeric: false, disablePadding: true, label: 'Prénom' },
  { id: 'lastName', numeric: false, disablePadding: false, label: 'Nom' },
  { id: 'dateOfBirth', numeric: false, disablePadding: false, label: 'Date de Naissance' },
  { id: 'street', numeric: false, disablePadding: false, label: 'Rue' },
  { id: 'city', numeric: false, disablePadding: false, label: 'Ville' },
  { id: 'state', numeric: false, disablePadding: false, label: 'Etat' },
  { id: 'zipCode', numeric: false, disablePadding: false, label: 'Code Postal' },
  { id: 'department', numeric: false, disablePadding: false, label: 'Département' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Date de début' },
];

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <thead className="table-head">
      <tr className="table-row">
        <th className="table-cell">
          <input
            type="checkbox"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            aria-label="select all employees"
            className="checkbox"
          />
        </th>
        {headCells.map((headCell) => (
          <th
            key={headCell.id}
            onClick={createSortHandler(headCell.id)}
            className="table-cell sortable-cell"
          >
            {headCell.label}
              <span className="sort-icon">
                {order === 'desc' ? ' ↓' : ' ↑'}
              </span>
          </th>
        ))}
      </tr>
    </thead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({ numSelected, selected, setSelected, removeEmployee }) {
  const handleDelete = () => {
    selected.forEach((index) => {
      removeEmployee(index);
    });
    setSelected([]);
  };

  return (
    <div className="toolbar">
      {numSelected > 0 ? (
        <>
          <h3>{numSelected} sélectionné(s)</h3>
          <button onClick={handleDelete} className="delete-button">Supprimer</button>
        </>
      ) : (
        <h3 className="table-title">Liste des Employés</h3>
      )}
    </div>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  removeEmployee: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default function EnhancedTable() {
  const { employees, removeEmployee } = useContext(EmployeeContext);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstName');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useSearch(employees, searchTerm);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = employees.map((n) => n.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = useMemo(() => {
    const sortedData = stableSort(filteredData, getComparator(order, orderBy));
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, order, orderBy, page, rowsPerPage]);

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - employees.length);

  return (
    <div className="table-container">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Rechercher prénom/nom"
        className="search-input"
      />

      <EnhancedTableToolbar
        numSelected={selected.length}
        selected={selected}
        setSelected={setSelected}
        removeEmployee={removeEmployee}
      />

      <table className="table">
        <EnhancedTableHead
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={employees.length}
        />
        <tbody className="table-body">
          {visibleRows.map((employee, index) => {
            const isItemSelected = selected.indexOf(index) !== -1;
            return (
              <tr
                key={employee.id || index}
                onClick={() => handleClick(index)}
                className={`table-row ${isItemSelected ? 'selected-row' : ''}`}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={isItemSelected}
                    onChange={() => handleClick(index)}
                    className="checkbox"
                  />
                </td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.dateOfBirth}</td>
                <td>{employee.street}</td>
                <td>{employee.city}</td>
                <td>{employee.state}</td>
                <td>{employee.zipCode}</td>
                <td>{employee.department}</td>
                <td>{employee.startDate}</td>
              </tr>
            );
          })}
          {emptyRows > 0 && (
            <tr>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <span>Nombre d'employés : {filteredData.length}</span>
        <div>
          <label>
            Lignes par page :
            <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="rows-per-page-select">
              {[5, 10, 25].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className='pagination-button-group'>
        <span className='page-info'>Page {page + 1} sur {Math.ceil(employees.length / rowsPerPage)}</span>
          <button onClick={() => handleChangePage(page - 1)} disabled={page === 0} className="pagination-button">
          &lt; {/* Signe "<" */}
          </button>
          <button onClick={() => handleChangePage(page + 1)} disabled={page >= Math.ceil(employees.length / rowsPerPage) - 1} className="pagination-button">
          &gt; {/* Signe ">" */}
          </button>
        </div>
      </div>
    </div>
  );
}

EnhancedTable.propTypes = {
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      dateOfBirth: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
    })
  ),
};
