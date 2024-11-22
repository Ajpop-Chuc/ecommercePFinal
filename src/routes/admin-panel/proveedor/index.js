import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Toolbar,
  Grid,
  Container,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(to right, #77B5FE, #3A82DC)', // Fondo degradado suave
    minHeight: '100vh',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tableContainer: {
    margin: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff', // Fondo blanco para la tabla
  },
  tableHeader: {
    backgroundColor: '#1c2c5b', // Azul más oscuro
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  actionIcons: {
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    color: theme.palette.info.main,
  },
  toggleButton: {
    color: theme.palette.warning.main,
  },
  searchBar: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    backgroundColor: '#ffffff', // Fondo blanco para la barra de búsqueda
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  searchField: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#1c2c5b',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#142041',
    },
  },
}));

const ProveedoresTabla = () => {
  const classes = useStyles();
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/suppliers');
        setProveedores(response.data.suppliers);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };
    fetchProveedores();
  }, []);

  const toggleProveedor = async (id, isActive) => {
    try {
      await axios.put(`http://localhost:4000/api/suppliers/${id}`, {
        isActive: !isActive,
      });
      setProveedores((prev) =>
        prev.map((proveedor) =>
          proveedor._id === id ? { ...proveedor, isActive: !isActive } : proveedor
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estado del proveedor:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProveedores = proveedores.filter((proveedor) =>
    proveedor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={classes.root}>
      <Toolbar className={classes.searchBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              className={classes.searchField}
              label="Buscar Proveedores"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={4} container justifyContent="flex-end">
            <Button
              className={classes.addButton}
              startIcon={<AddIcon />}
              onClick={() => history.push('/admin-panel/admin/vendedor-add')}
            >
              Agregar Proveedor
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
      <Container maxWidth="lg">
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>Nombre</TableCell>
                <TableCell className={classes.tableHeader}>Email</TableCell>
                <TableCell className={classes.tableHeader}>Teléfono</TableCell>
                <TableCell className={classes.tableHeader}>Dirección</TableCell>
                <TableCell className={classes.tableHeader}>
                  Productos Suministrados
                </TableCell>
                <TableCell className={classes.tableHeader} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor._id}>
                  <TableCell>{proveedor.name}</TableCell>
                  <TableCell>{proveedor.contactInfo?.email || 'N/A'}</TableCell>
                  <TableCell>{proveedor.contactInfo?.phone || 'N/A'}</TableCell>
                  <TableCell>{proveedor.contactInfo?.address || 'N/A'}</TableCell>
                  <TableCell>
                    {proveedor.productsSupplied?.length > 0
                      ? proveedor.productsSupplied.join(', ')
                      : 'Sin productos'}
                  </TableCell>
                  <TableCell align="center" className={classes.actionIcons}>
                    <IconButton
                      className={classes.editButton}
                      onClick={() =>
                        history.push(`/proveedores/editar/${proveedor._id}`)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      className={classes.toggleButton}
                      onClick={() =>
                        toggleProveedor(proveedor._id, proveedor.isActive)
                      }
                    >
                      {proveedor.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default ProveedoresTabla;
