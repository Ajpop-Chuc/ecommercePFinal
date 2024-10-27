import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, Grid, Divider, TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import axios from 'axios';

const UserPopup = ({ user, onSave, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setUserData(user); // Cargar los datos iniciales del usuario
  }, [user]);

  // Obtener el token del localStorage
  const token = localStorage.getItem('token'); // Cambia 'your_token_key' por la clave real del token en el localStorage

  // Configurar el token de autorización en las solicitudes de Axios
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setUserData(user); // Restablecer datos al original al cerrar
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: checked }));
  };

  const handleSave = async () => {
    try {
      const { _id, ...updateData } = userData;
      const response = await axiosInstance.put(`http://127.0.0.1:4000/api/users/${_id}`, updateData);
      
      if (onSave) onSave(response.data); // Llamar a onSave después de guardar
      handleClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <React.Fragment>
      <Button className="action-btn" onClick={handleClickOpen}>
        <i className="material-icons primary-color">edit</i>
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogContent className="p-20 text-center">
          <div className="user-info-wrap bg-base">
            <h4 className="mb-sm-20 mb-10">Editar Usuario</h4>
            <div className="p-sm-30 p-15">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    name="name"
                    value={userData.name || ''}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Apellido"
                    name="lastName"
                    value={userData.lastName || ''}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={userData.email || ''}
                    onChange={handleInputChange}
                    type="email"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre de usuario"
                    name="username"
                    value={userData.username || ''}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Contraseña"
                    name="password"
                    value={userData.password || ''}
                    onChange={handleInputChange}
                    type="password"
                    fullWidth
                  />
                  <TextField
                    label="Tipo de usuario"
                    name="type"
                    value={userData.type || ''}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="customer">Cliente</option>
                    <option value="admin">Admin</option>
                    <option value="employee">Empleado</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userData.isActive || false}
                        onChange={handleCheckboxChange}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label="Activo"
                  />
                </Grid>
              </Grid>
            </div>
          </div>
          <Divider className="my-20" />
          <div className="p-sm-30 p-15 d-sm-flex justify-content-between align-items-center">
            <Button className="button btn-active btn-lg mb-20 mr-20" onClick={handleSave}>
              Guardar Cambios
            </Button>
            <Button className="button btn-active btn-lg mb-20" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default UserPopup;