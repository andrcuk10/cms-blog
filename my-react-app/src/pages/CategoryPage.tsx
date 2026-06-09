import { useState, useEffect } from "react";
import type { CategoryDTO, CategoryListingPage, metaData, NewCategoryRes } from "../utils/response";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import SingleCategory from '../components/SingleCategory'
import PaginationComponent from "../components/PaginationComponent";
import { useToast } from "../components/ToastContext";

const CategoryPage = () => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]); // Lista kategorija
    const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null); // Selektovana kategorija
    const [addCategory, setAddCategory] = useState<boolean>(false)

    const [meta, setMeta] = useState<metaData | null>(null)
    const { showToast } = useToast();
    
    // Funkcija za skraćivanje teksta
    const shortText = (text: string) => (text.length < 30 ? text : text.slice(0, 30) + "...");

    const handlePrevious = async () => {
        if(meta?.currentPage && meta.currentPage > 1)
            await fetchPage(meta.currentPage - 1) 
    }

    const handleNext = async () => {
        if(meta?.currentPage && meta.currentPage && meta.currentPage < meta.pageCount)
            await fetchPage(meta.currentPage + 1)
    }

    const updateCategory = async (category: CategoryDTO) => {
        try {
            const response = await fetch(`http://localhost:3000/categories/${category.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(category)
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            showToast('Uspesno azurirana kategorija', "success")
            
            const updatedCategories = categories.map((c) => 
                c.id === category.id ? category : c
            )
            setCategories(updatedCategories)
        } catch (error) {
            showToast('Greška prilikom azuriraznja kategorije', 'danger')
        }
    }

    const removeCategory = async (category: CategoryDTO) => {
        try {
            const response = await fetch(`http://localhost:3000/categories/${category.id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            showToast('Uspesno obrisana kategorija', "success")
            
            const newCategories = categories.filter((c) => c.id !== category.id)
            setCategories(newCategories)
        } catch (error) {
            showToast('Greška prilikom brisanja kategorije', 'danger') 
        }
    }

    const createCategory = async (category: CategoryDTO) => {
        try {
            const response = await fetch(`http://localhost:3000/categories`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({ name: category.name, description: category.description})
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result: NewCategoryRes = await response.json()

            showToast('Uspesno kreirana kategorija', "success")
            
            const createdCategory: CategoryDTO = {
                name: category.name,
                description: category.description,
                id: result.category_id
            }
            
            setCategories([createdCategory, ...categories].slice(0, 5))
        } catch (error) {
            showToast('Greška prilikom kreiranja kategorije', 'danger')
        }
    }

    const fetchPage = async (page: number) => {
        try {
            const response = await fetch(`http://localhost:3000/categories?limit=5&page=${page}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result: CategoryListingPage = await response.json()
            // console.log(result)
            // Strict mode moze da doprinese duplom pozivu zbog identifikacije promena
            setCategories(result.categories); // Postavljamo podatke u state
            setMeta(result.meta)
        } catch (error) {
            showToast('Greška prilikom učitavanja kategorije', 'danger')
        }
    }

    // Učitavanje kategorije pri prvom renderovanju
    useEffect(() => {
        fetchPage(1);
    }, []);

    return (
        <>
          <Container className="mt-4">
            <h1 className="text-center mb-4">Kategorije</h1>

            <Row>
                {/* Tabela sa predmetima */}
                <Col md={5}>
                    <Button 
                        style={{ display: 'flex', flexDirection: 'row', justifySelf: 'end', margin: 5 }} 
                        variant="success" 
                        onClick={() => { 
                            setSelectedCategory(null);
                            setAddCategory(true);
                        }}
                    >Dodaj</Button>
                    <Table striped bordered hover responsive>
                        <thead className="table-primary">
                        <tr>
                            <th>Naziv</th>
                            <th>Opis</th>
                            <th>Izmeni</th>
                            <th>Obrisi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category: CategoryDTO) => (
                            <tr key={category.id}>
                                <td style={{ cursor: "pointer" }}>{category.name}</td>
                                <td>{shortText(category.description)}</td>
                                <td>{<Button variant="info" onClick={() => setSelectedCategory(category)}>Update</Button>}</td>
                                <td>{<Button variant="danger" onClick={() => removeCategory(category)}>Remove</Button>}</td>
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
                    {selectedCategory && (
                        <SingleCategory category={selectedCategory} onUpdate={updateCategory} />
                    )}
                    {addCategory && !selectedCategory && (
                        <SingleCategory onUpdate={createCategory} />
                    )}
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default CategoryPage;