import { useState, useEffect } from "react";
import type { metaData, NewNewsRes, NewsDTO, NewsListingPage, SingleNewsRes } from "../utils/response";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import SingleNews from '../components/SingleNews'
import PaginationComponent from "../components/PaginationComponent";
import { formatDate } from "../utils/date";
import type { CategoryDTO, CategoryListingPage } from "../utils/response";
import type { NewsProp } from "../utils/types";
import { useToast } from "../components/ToastContext";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
    const [news, setNews] = useState<NewsDTO[]>([]); // Lista vesti
    const [selectedNews, setSelectedNews] = useState<NewsDTO | null>(null); // Selektovana kategorija
    const [addNews, setAddNews] = useState<boolean>(false)
    const [categories, setCategories] = useState<CategoryDTO[]>([]);

    const { showToast } = useToast();
    const navigate = useNavigate()

    const [meta, setMeta] = useState<metaData | null>(null)
    
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

    const updateNews = async (nw: NewsProp) => {
        try {
            const response = await fetch(`http://localhost:3000/news/${nw.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    ...nw,
                    tags: nw.tags.join(" ")
                })
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            
            const result: NewNewsRes = await response.json()

            showToast('Uspesno azurirana vest', "success")

            const updatedNews = await fetchNews(result.news_id)

            setNews((prevNews) => {
                const exists = prevNews.filter(item => item.id !== updatedNews?.id);
                
                return updatedNews ? [updatedNews, ...exists].slice(0, 5) : prevNews;
            });
        } catch (error) {
            showToast('Greška prilikom azuriraznja vesti', "danger")
        }
    }

    const removeNews = async (nw: NewsDTO) => {
        try {
            const response = await fetch(`http://localhost:3000/news/${nw.id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            showToast('Uspesno obrisana vest', "success")
            
            const newNews: NewsDTO[] = news.filter((n) => n.id !== nw.id)
            setNews(newNews)
        } catch (error) {
            showToast('Greška prilikom brisanja vesti', "danger")
        }
    }

    const createNews = async (nw: NewsProp) => {
        try {
            const response = await fetch(`http://localhost:3000/news`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({ 
                    title: nw.title,
                    text: nw.text,
                    category_id: nw.categoryId,
                    tags: nw.tags.join(" "), 
                })
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result: NewNewsRes = await response.json()
            showToast('Uspesno kreirana vest', "success")
            
            const createdNews = await fetchNews(result.news_id)
            if(createdNews) setNews([createdNews, ...news].slice(0, 5))
        } catch (error) {
            showToast('Greška prilikom kreiranja vesti', "danger")
        }
    }

    const fetchPage = async (page: number) => {
        try {
            const response = await fetch(`http://localhost:3000/news?limit=5&page=${page}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result: NewsListingPage = await response.json()
            // console.log(result)
            // Strict mode moze da doprinese duplom pozivu zbog identifikacije promena
            setNews(result.news); // Postavljamo podatke u state
            setMeta(result.meta)
        } catch (error) {
            showToast('Greška prilikom ucitavanja vesti', "danger")
        }
    }

    const fetchNews = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:3000/news/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result: SingleNewsRes = await response.json()
            // console.log(result)
            // Strict mode moze da doprinese duplom pozivu zbog identifikacije promena
            
            return result.news
        } catch (error) {
            console.error("Greška prilikom učitavanja kategorije:", error);
            return null
        }
    }

    const handleCardClick = (id: string) => {
        navigate(`/public/news/${id}`);
    };

    // Učitavanje kategorije pri prvom renderovanju
    useEffect(() => {
        fetchPage(1);

        fetch("http://localhost:3000/categories?limit=25&page=1")
            .then((res) => res.json())
            .then((data: CategoryListingPage) => {
                setCategories(data.categories)
            });
    }, []);

    return (
        <>
          <Container className="mt-4">
            <h1 className="text-center mb-4">Vesti</h1>

            <Row>
                {/* Tabela sa predmetima */}
                <Col md={5}>
                    <Button 
                        style={{ display: 'flex', flexDirection: 'row', justifySelf: 'end', margin: 5 }} 
                        variant="success" 
                        onClick={() => { 
                            setSelectedNews(null);
                            setAddNews(true);
                        }}
                    >Dodaj</Button>
                    <Table striped bordered hover responsive>
                        <thead className="table-primary">
                        <tr>
                            <th>Naslov</th>
                            <th>Autor</th>
                            <th>Datum</th>
                            <th>Izmeni</th>
                            <th>Obrisi</th>
                        </tr>
                        </thead>
                        <tbody>
                            {news.map((n: NewsDTO) => (
                                <tr key={n.id}>
                                    <td style={{ cursor: "pointer" }} onClick={(e) => handleCardClick(n.id)}>{shortText(n.title)}</td>
                                    <td>{shortText(`${n.author.first_name} ${n.author.last_name}`)}</td>
                                    <td>{formatDate(n.createdAt)}</td>
                                    <td>{<Button variant="info" onClick={() => setSelectedNews(n)}>Update</Button>}</td>
                                    <td>{<Button variant="danger" onClick={() => removeNews(n)}>Remove</Button>}</td>
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
                    {selectedNews && (
                        <SingleNews post={selectedNews} categories={categories} onUpdate={updateNews} />
                    )}
                    {addNews && !selectedNews && (
                        <SingleNews onUpdate={createNews} categories={categories} />
                    )}
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default CategoryPage;