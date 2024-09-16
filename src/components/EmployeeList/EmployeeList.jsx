import * as React from 'react';
import { useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { EmployeeContext } from '../../utils/EmployeeContext';
import { useSearch } from '../../utils/useSearch';

//import mockData from '../../data/MOCK_DATA.json'

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
  { id: 'department', numeric: false, disablePadding: false, label: 'Department' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Date de début' },
  // Ajoutez d'autres colonnes nécessaires ici
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{
              backgroundColor: '#A6BC43', // Pour changer le fond
            }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all employees',
            }}
          />
        </TableCell >
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontSize: '16px',
              fontWeight: 'bold', // Pour mettre le texte en gras
              backgroundColor: '#A6BC43', // Pour changer le fond
              width: headCell.width || 'auto', // Largeur personnalisée
              whiteSpace: 'nowrap', // Pour empêcher le retour à la ligne
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
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

function EnhancedTableToolbar(props) {
  const { numSelected, selected, setSelected, removeEmployee } = props;

  const handleDelete = () => {
    selected.forEach((index) => {
      removeEmployee(index); // Supprimer l'employé
    });
    setSelected([]);
  };


  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Liste des Employés
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            {/* <FilterListIcon /> */}
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired, // Tableau d'indices sélectionnés
  removeEmployee: PropTypes.func.isRequired, // Fonction pour supprimer un employé
  setSelected: PropTypes.func.isRequired, // Fonction pour mettre à jour la sélection
};

export default function EnhancedTable() {
  const { employees, removeEmployee } = useContext(EmployeeContext); // Récupérez les employés du contexte

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('firstName'); // Par défaut, trier par prénom
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [searchTerm, setSearchTerm] = useState(''); // État pour stocker la recherche
  //const filteredData = useSearch(mockData, searchTerm); // Utilisation du hook de recherche
  const filteredData = useSearch(employees, searchTerm); // Utilisation du hook de recherche

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Met à jour le terme de recherche
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = employees.map((n) => n.id);
      //const newSelected = mockData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, index) => {
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
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Réinitialise la page lors du changement du nombre de lignes par page
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  //const isSelected = (id) => selected.indexOf(id) !== -1;
  const isSelected = (index) => selected.indexOf(index) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;
    //page > 0 ? Math.max(0, (1 + page) * rowsPerPage - mockData.length) : 0;

    const visibleRows = useMemo(() => {
      // On trie d'abord les données filtrées selon la colonne choisie
      const sortedData = stableSort(
        filteredData, // Les données sont d'abord filtrées par la recherche
        getComparator(order, orderBy) // Puis triées selon les préférences
      );
    
      // Ensuite, on applique la pagination
      return sortedData.slice(
        page * rowsPerPage, // On calcule l'indice de départ de la page
        page * rowsPerPage + rowsPerPage // Et l'indice de fin de la page
      );
    }, [filteredData, order, orderBy, page, rowsPerPage]); // On recalcul le résultat chaque fois que ces dépendances changent

  return (
    
    <Box sx={{ width: '100%' }}>
      {/* Champs de recherche */}
      <TextField
        label="Recherche prénom/nom"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', backgroundColor: '#ffff', borderRadius: '5px'}}
      />
      <Paper sx={{ width: '100%', mb: 2, border: '1px solid #9cb52f'}}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected} removeEmployee={removeEmployee}/>
        
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={employees.length}
              //rowCount={mockData.length}
            />
            <TableBody>
              
              {visibleRows.map((employee, index) => {
                //const isItemSelected = isSelected(row.id);
                const isItemSelected = isSelected(index);
                const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, index)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        //key={row.id}
                        key={employee.id || index}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {employee.firstName}
                        </TableCell>
                        <TableCell align="left">{employee.lastName}</TableCell>
                        <TableCell align="left">{employee.dateOfBirth}</TableCell>
                        <TableCell align="left">{employee.street}</TableCell>
                        <TableCell align="left">{employee.city}</TableCell>
                        <TableCell align="left">{employee.state}</TableCell>
                        <TableCell align="left">{employee.zipCode}</TableCell>
                        <TableCell align="left">{employee.department}</TableCell>
                        <TableCell align="left">{employee.startDate}</TableCell>
                      </TableRow>
                  );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          //count={employees.length}
          count={filteredData.length} //nombre total de ligne
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}

EnhancedTable.propTypes = {
  employees: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number, // L'ID de l'employé
    firstName: PropTypes.string.isRequired, // Le prénom de l'employé
    lastName: PropTypes.string.isRequired, // Le nom de l'employé
    dateOfBirth: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zipCode: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
  })), // Un tableau d'objets employés
};