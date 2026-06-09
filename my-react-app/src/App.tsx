import {lazy, Suspense} from "react"
import type {ReactElement} from "react"
import NavigationBar from "./components/NavigationBar"
import './App.css'
import {isAuthenticated, isAuthorized} from "./auth.ts";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import {Spinner} from "react-bootstrap"
import UsersPage from "./pages/UsersPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import MostViewedPage from "./pages/MostViewedPage.tsx";
import CategoryPublicPage from "./pages/CategoryPublicPage.tsx";
import SingleNewsPage from "./pages/SingleNewsPage.tsx";

// Layz-loading je tehnika koja omogucuje da se komponente ucitavaju samo kada su potrebne, npr. kada se pogodi ruta
// Ovo znaci da se komponente ucitavaju asinhrono, sto znaci da se ucitavaju u pozadini
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

interface PrivateRouteProps {
  element: ReactElement;
}

/**Ovo je privatna ruta koja proverava da li je korisnik prijavljen tako
 element je komponenta koju želimo da prikažemo ako je korisnik prijavljen
 ako je false onda korisnika preusmeravamo na login stranicu */
const PrivateRoute = ({element}: PrivateRouteProps) => {
  return isAuthenticated() ? element : <Navigate to="/login"/>;
};

function App() {

  return (
    <>
          <div className="App">
                <Router>
                  <div className="app-container">
                      <NavigationBar/>
                      <main className="main-content">
                        {/* Suspense je komponenta koja omogucuje da se nesto izvrsi dok se ne ucta strana.
                         Kod nas je to Spinner komponenta (kruzic) */}
                        <Suspense fallback={
                            <Spinner animation="border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </Spinner>
                          }>
                            <Routes>
                              {/* Kada se pogodi ruta prikazuje se komponenta (element) koja odgovara ruti */}
                              <Route path="/login" element={<LoginPage/>}/>
                              <Route path="/public" element={<HomePage/>}/>
                              <Route path="/public/most-viewed" element={<MostViewedPage/>}/>
                              <Route path="/public/category/:id" element={<CategoryPublicPage/>}/>
                              <Route path="/public/news/:id" element={<SingleNewsPage/>}/>
                              {/* PrivateRoute je komponenta koja proverava da li je korisnik prijavljen */}
                              <Route path="/" element={<PrivateRoute element={<CategoryPage/>}/>}/>
                              <Route path="/news" element={<PrivateRoute element={<NewsPage/>}/>}/>
                              <Route path="/users" element={isAuthorized() ? <PrivateRoute element={<UsersPage/>}/> : <Navigate to="/" replace/> }/>
                            </Routes>
                        </Suspense>
                      </main>
                  </div>
                </Router>
            </div>
    </>
  )
}

export default App
