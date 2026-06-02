import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {isAuthenticated, isAuthorized, loggedUser, logout} from "../auth.ts";

const NavigationBar = () => {
    const location = useLocation();  // Dobijamo trenutnu rutu
    const navigate = useNavigate();  // Funkcija za navigaciju između stranica

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                {/* Link do početne stranice, Brand je poput Home page-a */}
                <Navbar.Brand as={Link} to="/">RAF Novosti</Navbar.Brand>

                {/* Dugme za prikazivanje menija na manjim ekranima */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* Glavni meni */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Linkovi ka različitim sekcijama */}
                        <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>
                            Kategorije
                        </Nav.Link>
                        <Nav.Link as={Link} to="/news" className={location.pathname === "/news" ? "active" : ""}>
                            Vesti
                        </Nav.Link>
                        {isAuthorized() && <Nav.Link as={Link} to="/users" className={location.pathname === "/users" ? "active" : ""}>
                            Korisnici
                        </Nav.Link>}
                    </Nav>

                    {isAuthenticated() ? (
                        <div>
                            <p>{ loggedUser?.role }</p>
                            <Button variant="danger" onClick={() => logout(navigate)}>Logout</Button>
                        </div>
                    ) : (
                        <Button variant="success" as={Link as any} to="/login">Login</Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;