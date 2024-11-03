import React from 'react';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { Link, withRouter } from 'react-router-dom';

class SignIn extends React.Component {
    state = {
        email: '',
        password: '',
        error: ''
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = this.state;

        try {
            const response = await fetch('http://127.0.0.1:4000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.map(err => err.message).join(', ') || 'Credenciales incorrectas');
            }

            const data = await response.json();
            console.log('Inicio de sesión exitoso:', data);

            // Guardar el token en localStorage con Bearer
            localStorage.clear();
            localStorage.setItem('token', `Bearer ${data.token}`);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('usertype', data.user.type);
            localStorage.setItem('userName', data.user.name + " " +data.user.lastName);

            // Redirigir a otra página después de inicio de sesión exitoso
            if(data.user.type === "customer"){
                this.props.history.push('/home-one');
            }
            else{
                this.props.history.push('/admin-panel/admin');
            }

        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    render() {
        const { email, password, error } = this.state;

        return (
            <div>
                <h4>Inicio de sesión</h4>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <TextField
                            required
                            label="Correo electrónico"
                            className="iron-form-input-wrap"
                            type="email"
                            name="email"
                            value={email}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="mb-15">
                        <TextField
                            required
                            label="Contraseña"
                            className="iron-form-input-wrap"
                            type="password"
                            name="password"
                            value={password}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="d-sm-flex justify-content-between align-items-center mb-sm-10 mb-20">
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox value="checkedA" color="primary" />}
                                label="Remember Me"
                            />
                        </FormGroup>
                        <span className="d-inline-block"><Link to="/forget-password">Recuperar contraseña</Link></span>
                    </div>
                    <Button type="submit" className="button btn-active btn-lg mb-25">
                        Iniciar sesión
                    </Button>
                    <p className="mb-0"><Link to="/sign-up">Crear cuenta</Link></p>
                </form>
            </div>
        );
    }
}

export default withRouter(SignIn);
