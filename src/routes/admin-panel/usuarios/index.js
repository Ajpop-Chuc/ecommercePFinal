import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useTable, usePagination } from 'react-table';
import axios from 'axios';
import ContentLoader from '../../../components/global/loaders/ContentLoader';
import ConfirmationBox from './usuarios-add/components/ConfirmationBox';
import UserPopup from './usuarios-add/components/UserPopup';

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  return (
    <div className="ReactTable">
      <table {...getTableProps()} className="rt-table">
        <thead className="rt-thead -header">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="rt-tr">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="rt-th">{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="rt-tbody">
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="rt-tr">
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="rt-td">{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-bottom">
        <div className="-pagination">
          <div className="-previous">
            <button className="-btn" type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </button>
          </div>
          <div className="-center">
            <span className="-pageInfo">
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
            <span className="select-wrap -pageSizeOptions">
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </span>
          </div>
          <div className="-next">
            <button className="-btn" type="button" onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

class UsuariosLista extends Component {
  constructor(props) {
    super(props);
    this.confirmationDialog = React.createRef();
    this.state = {
      usuarios: [],
      searchUserText: '',
      loading: true,
      selectedUser: null,
    };
    this.allUsuarios = []; // Almacena todos los datos de los usuarios
  }

  componentDidMount() {
    // Configurar el interceptor de Axios para incluir el token de autorización
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    this.getUsuariosData();
  }

  // Obtener lista de usuarios
  getUsuariosData() {
    axios.get('http://127.0.0.1:4000/api/users')
      .then(response => {
        const usuarios = response.data.users.map((usuario, index) => ({
          ...usuario,
          count: index + 1, // Agrega el contador de índice aquí
        }));
        this.setState({
          usuarios,
          loading: false,
        });
        this.allUsuarios = usuarios; // Almacenamos todos los usuarios
      })
      .catch(error => {
        console.error('Error fetching usuarios:', error);
        this.setState({ loading: false });
      });
  }

  onSearchUser = (searchText) => {
    if (searchText === '') {
      this.setState({
        usuarios: this.allUsuarios,
        searchUserText: searchText,
      });
    } else {
      const searchUsuarios = this.allUsuarios.filter(usuario => {
        return usuario.name.toLowerCase().includes(searchText.toLowerCase());
      });
      this.setState({
        searchUserText: searchText,
        usuarios: searchUsuarios,
      });
    }
  }

  onDeleteUser = (data) => {
    this.data = data;
    this.confirmationDialog.current.openDialog();
  }

  deleteUser = (popupResponse) => {
    if (popupResponse) {
      const deleteItem = this.data;
      const newData = this.state.usuarios.filter(usuario => usuario._id !== deleteItem._id);
      this.setState({
        usuarios: newData,
      });
    }
  }

  updateUserInList = (updatedUser) => {
    this.setState((prevState) => ({
      usuarios: prevState.usuarios.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      ),
    }));
  };

  handleEditUser = (user) => {
    this.setState({ selectedUser: user });
  };
  
  render() {
    const { usuarios, loading, searchUserText, selectedUser } = this.state;
    const columns = [
      {
        maxWidth: 75,
        Header: 'No.',
        accessor: 'count',
      },
      {
        sortable: false,
        Header: 'Nombre',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Tipo',
        accessor: 'type',
      },
      {
        Header: 'Estado',
        accessor: 'isActive',
        Cell: ({ value }) => (value ? 'Activo' : 'Inactivo'), // Formatea el estado
      },
      {
        Header: 'Acciones',
        accessor: 'action',
        Cell: props => {
          const user = props.row.original; // Obtener el usuario actual
          return (
            <div>
              <UserPopup user={user} /> {/* Pasar `user` como prop para editar */}
            </div>
          );
        },
      },
    ];    

    return (
      <Fragment>
        {!loading ? (
          <div className="inner-container">
            <div className="iron-user-list-wrap">
              <div className="page-title mb-20">
                <h4 className="mb-0">Lista de Usuarios</h4>
              </div>
              <div className="iron-shadow rounded p-sm-20 p-15 mb-30 bg-base">
                <Grid container spacing={3} className="my-0">
                  <Grid item xs={12} sm={12} md={6} lg={5} className="py-0 d-sm-flex d-block">
                    <TextField
                      label="Buscar Usuarios"
                      className="my-0 iron-form-input-wrap mr-5"
                      fullWidth
                      value={searchUserText}
                      onChange={(e) => this.onSearchUser(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="iron-shadow rounded p-20 bg-base">
                <Table
                  columns={columns}
                  data={usuarios.map((user) => ({
                    ...user,
                    onEdit: () => this.handleEditUser(user), // Agrega un método para manejar la edición
                  }))}
                />
                {selectedUser && (
                  <UserPopup user={selectedUser} onSave={this.updateUserInList} />
                )}
              </div>
            </div>
            <ConfirmationBox
              ref={this.confirmationDialog}
              onConfirm={(res) => this.deleteUser(res)}
            />
          </div>
        ) : (
          <ContentLoader />
        )}
      </Fragment>
    );
  }
}

export default UsuariosLista;
