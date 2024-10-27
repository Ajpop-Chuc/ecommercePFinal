import React from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';

class ConfirmationBox extends React.Component {
  state = {
    open: false,
  };

  // Abre el cuadro de diálogo de confirmación
  openDialog = () => {
    this.setState({ open: true });
  };

  // Cierra el cuadro de diálogo de confirmación
  closeDialog = () => {
    this.setState({ open: false });
  };

  // Maneja la respuesta del usuario y cierra el cuadro de diálogo
  onCloseDialog = (isTrue) => {
    this.setState({ open: false });
    this.props.onConfirm(isTrue); // Llama a la función onConfirm con la respuesta
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
