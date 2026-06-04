import { useState, useEffect } from "react";
import type { metaData, NewUserRes, SingleUserRes, UserDTO, UserListingPage, UserUpdateRes } from "../utils/response";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import PaginationComponent from "../components/PaginationComponent";
import type { CreateUserType } from "../utils/types";
import SingleUser from "../components/SingleUser";

const UserPage = () => {
    const [users, setUsers] = useState<UserDTO[]>([]); // Lista kategorija
    const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null); // Selektovana kategorija
    const [addUser, setAddUser] = useState<boolean>(false)

    const [meta, setMeta] = useState<metaData | null>(null)
    
    // Funkcija za skraćivanje teksta
    // const shortText = (text: string) => (text.length < 30 ? text : text.slice(0, 30) + "...");

    const handlePrevious = async () => {
        if(meta?.currentPage && meta.currentPage > 1)
            await fetchPage(meta.currentPage - 1) 
    }

    const handleNext = async () => {
        if(meta?.currentPage && meta.currentPage && meta.currentPage < meta.pageCount)
            await fetchPage(meta.currentPage + 1)
    }

    const updateUser = async (user: UserDTO) => {
        console.log('update ',user)
        try {
            const response = await fetch(`http://localhost:3000/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(user)
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result: NewUserRes = await response.json()
            
            const updatedUser = await fetchUser(result.user_id)

            setUsers((prevUsers) => {
                const exists = prevUsers.filter(item => item.id !== updatedUser?.id);
                
                return updatedUser ? [updatedUser, ...exists].slice(0, 5) : prevUsers;
            });
        } catch (error) {
            console.error("Greška prilikom azuriranja korisnika:", error);
        }
    }

    const removeUser = async (user: UserDTO) => {
        console.log('remove ', user)
        try {
            const response = await fetch(`http://localhost:3000/users/${user.id}/status`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result: UserUpdateRes = await response.json()

            user.status = result.status
            
            setUsers((prevUsers) => {
                const exists = prevUsers.filter(item => item.id !== user.id);
                
                return [user, ...exists].slice(0, 5);
            });
        } catch (error) {
            console.error("Greška prilikom azuriraznja kategorije:", error);
        }
    }

    const createUser = async (user: CreateUserType) => {
        console.log('create ', user)
        user.status = true
        try {
            const response = await fetch(`http://localhost:3000/users`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(user)
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result: NewUserRes = await response.json()
            
            const createdUser: UserDTO = {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                status: user.status,
                id: result.user_id
            }
            
            setUsers([createdUser, ...users].slice(0, 5))
        } catch (error) {
            console.error("Greška prilikom dodavanja korisnika:", error);
        }
    }

    const fetchPage = async (page: number) => {
        try {
            const response = await fetch(`http://localhost:3000/users?limit=5&page=${page}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
            });
            
            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result: UserListingPage = await response.json()
            // console.log(result)
            // Strict mode moze da doprinese duplom pozivu zbog identifikacije promena
            setUsers(result.users); // Postavljamo podatke u state
            setMeta(result.meta)
        } catch (error) {
            console.error("Greška prilikom učitavanja kategorije:", error);
        }
    }

    const fetchUser = async (id: string) => {
            try {
                const response = await fetch(`http://localhost:3000/users/${id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                    },
                });
                
                if(!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const result: SingleUserRes = await response.json()
                // console.log(result)
                // Strict mode moze da doprinese duplom pozivu zbog identifikacije promena
                
                return result.user
            } catch (error) {
                console.error("Greška prilikom učitavanja korisnika:", error);
                return null
            }
    }

    // Učitavanje korisnika pri prvom renderovanju
    useEffect(() => {
        fetchPage(1);
    }, []);

    return (
        <>
          <Container className="mt-4">
            <h1 className="text-center mb-4">Korisnici</h1>

            <Row>
                {/* Tabela sa predmetima */}
                <Col md={5}>
                    <Button 
                        style={{ display: 'flex', flexDirection: 'row', justifySelf: 'end', margin: 5 }} 
                        variant="success" 
                        onClick={() => { 
                            setSelectedUser(null);
                            setAddUser(true);
                        }}
                    >Dodaj</Button>
                    <Table striped bordered hover responsive>
                        <thead className="table-primary">
                        <tr>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Email</th>
                            <th>Tip</th>
                            <th>Izmeni</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user: UserDTO) => (
                            <tr key={user.id}>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{<Button variant="info" onClick={() => setSelectedUser(user)}>Izmeni</Button>}</td>
                                <td>{user.role !== 'admin' ? (
                                        <Button variant="danger" onClick={() => removeUser(user)}>{user.status ? 'Deaktiviraj' : 'Aktiviraj'}</Button>
                                    ) : (<></>)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    <PaginationComponent meta={meta} onNext={handleNext} onPrev={handlePrevious} />
                </Col>

                {/* Prikaz selektovanog predmeta */}
                <Col md={7}>
                    {/* null && string value = null */}
                    {/* !null && string value = string value */}
                    {/* false && string value = false */}
                    {/* true && string value = string value */}
                    {selectedUser && (
                        <SingleUser user={selectedUser} onUpdate={updateUser} />
                    )}
                    {addUser && !selectedUser && (
                        <SingleUser onUpdate={createUser} />
                    )}
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default UserPage;