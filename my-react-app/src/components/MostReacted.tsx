import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const MostReacted = () => {
    const [news, setNews] = useState<{ id: string; title: string }[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/news/most-reacted")
            .then((res) => res.json())
            .then((data) => setNews(data.news))
            .catch((err) => console.error("Greška pri učitavanju most reacted:", err));
    }, []);

    return (
        <Card className="m-3">
            <Card.Body>
                <Card.Title>Najreagovanije</Card.Title>
                {news.map((item) => (
                    <div key={item.id} className="mb-2">
                        <Link to={`/public/news/${item.id}`}>{item.title}</Link>
                    </div>
                ))}
            </Card.Body>
        </Card>
    );
};

export default MostReacted;