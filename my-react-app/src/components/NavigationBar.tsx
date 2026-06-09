import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {isAuthenticated, isAuthorized, loggedUser, logout} from "../auth.ts";
import { useEffect, useState } from "react";
import type { CategoryDTO, CategoryListingPage } from "../utils/response.ts";
import { useToast } from "./ToastContext.tsx";
import SearchBar from "./SearchBar.tsx";

const NavigationBar = () => {
    const location = useLocation();  // Dobijamo trenutnu rutu
    const navigate = useNavigate();  // Funkcija za navigaciju između stranica

    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const { showToast } = useToast();

    useEffect(() => {
        fetch("http://localhost:3000/categories?limit=25&page=1")
            .then((res) => res.json())
            .then((data: CategoryListingPage) => setCategories(data.categories))
            .catch(() => showToast('Greška pri učitavanja kategorije', "danger"))
    }, []);

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                {/* Link do početne stranice, Brand je poput Home page-a */}
                <Navbar.Brand as={Link} to="/public">RAF Novosti</Navbar.Brand>

                <SearchBar></SearchBar>

                {/* Dugme za prikazivanje menija na manjim ekranima */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* Glavni meni */}
                <Navbar.Collapse id="basic-navbar-nav">
                    { location.pathname.startsWith('/public') ? (
                        <Nav className="me-auto">
                            {/* Linkovi ka različitim sekcijama */}
                            <Nav.Link as={Link} to="/public" className={location.pathname === "/public" ? "active" : ""}>
                                Pocetna stranica
                            </Nav.Link>
                            <Nav.Link as={Link} to="/public/most-viewed" className={location.pathname === "/public/most-viewed" ? "active" : ""}>
                                Najcitanije
                            </Nav.Link>
                            <NavDropdown title="Kategorije" id="categories-dropdown">
                                {categories.map((cat) => (
                                    <NavDropdown.Item
                                        key={cat.id}
                                        as={Link}
                                        to={`/public/category/${cat.id}`}
                                        className={location.pathname === `/public/category/${cat.id}` ? "active" : ""}
                                    >
                                        {cat.name}
                                    </NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        </Nav>
                    ) : (
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
                    )}

                    {isAuthenticated() ? (
                        <div>
                            <span style={{ marginRight: 20, color: '#fff'}}>{ loggedUser?.name }</span>
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