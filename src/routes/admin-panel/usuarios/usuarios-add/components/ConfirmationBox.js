import React from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import axios from 'axios';

class ConfirmationBox extends React.Component {
  state = {
    open: false,
  };

  // Obtener el token del localStorage
  token = localStorage.getItem('token'); // Cambia 'your_token_key' por la clave real del token en el localStorage

  // Crear una instancia de axios con el encabezado de autorización
  axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${this.token}`,
    },
  });

  // Abre el cuadro de diálogo de confirmación
  openDialog = () => {
    this.setState({ open: true });
  };

  // Cierra el cuadro de diálogo de confirmación
  closeDialog = () => {
    this.setState({ open: false });
  };

  // Maneja la respuesta del usuario y cierra el cuadro de diálogo
  onCloseDialog = async (isTrue) => {
    this.setState({ open: false });
    if (isTrue) {
      try {
        // Ejemplo de solicitud de eliminación (reemplaza 'user_id' y la URL según tus necesidades)
        const response = await this.axiosInstance.delete(`http://127.0.0.1:4000/api/users/${this.props.userId}`);
        this.props.onConfirm(response.status === 200);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else {
      this.props.onConfirm(false);
    }
  };

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.closeDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent className="p-20 text-center">
          <h5 className="pt-sm-20 mb-0">¿Estás seguro de que deseas eliminar este usuario permanentemente?</h5>
        </DialogContent>
        <DialogActions className="px-20 pb-20 pt-sm-15 justify-content-center">
          <Button onClick={() => this.onCloseDialog(true)} className="button btn-active mr-15">
            Sí
          </Button>
          <Button onClick={() => this.onCloseDialog(false)} className="button btn-active">
            No
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmationBox;
