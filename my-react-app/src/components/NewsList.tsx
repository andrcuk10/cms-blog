import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import type{ NewsDTO, NewsListingPage } from "../utils/response";
import { useNavigate } from "react-router-dom";

const NewsList = ({ url }: { url: string }) => {
    const [news, setNews] = useState<NewsDTO[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        console.log(url)
        fetch(url)
            .then((res) => res.json())
            .then((data: NewsListingPage) => setNews(data.news))
            .catch(err => console.error('Greska prilikom dohvatanja vesti: ', err))
    }, []);

    const handleCardClick = (id: string) => {
        navigate(`/public/news/${id}`);
    };

    return (
        <div>
            {news.map((item) => (
                <Card key={item.id} className="mb-3" style={{ cursor: 'pointer' }} onClick={(e) => handleCardClick(item.id)}>
                    <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            {item.category.name} · {new Date(item.createdAt).toLocaleDateString("sr-RS")}
                        </Card.Subtitle>
                        <Card.Text>
                            {item.text.substring(0, 200)}...
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default NewsList;