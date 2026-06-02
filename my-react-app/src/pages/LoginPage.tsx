import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const login = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json()
            // console.log(result) // Da bismo videli odgovor i u konzoli
            localStorage.setItem('jwt', result.token);
            navigate('/');
        } catch (error) {
            setErrorMessage('Neispravno korisničko ime ili lozinka!');
            console.error('Login failed', error);
        }
    };
    /** Potpuno analogna stvar, koriscenjem Promise-a
     * const login = (event) => {
     *     event.preventDefault();
     *
     *     _axios.post('/api/users/login', { username, password })
     *         .then(response => {
     *             localStorage.setItem('jwt', response.data.jwt);
     *             navigate('/subjects');
     *         })
     *         .catch(error => {
     *             setErrorMessage('Neispravno korisničko ime ili lozinka!');
     *             console.error('Login failed', error);
     *         });
     * };
     */

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="col-md-4">
                <div className="card p-4 shadow">
                    <h2 className="text-center mb-4">Prijava na sistem</h2>

                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <form onSubmit={login}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Unesite email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Unesite lozinku"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Prijavi se</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;