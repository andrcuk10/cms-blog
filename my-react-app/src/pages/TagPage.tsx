import { useParams } from "react-router-dom";
import NewsList from "../components/NewsList";
import { useEffect, useState } from "react";
import type { SingleTagRes, Tag } from "../utils/response";
import { useToast } from "../components/ToastContext";

const TagPage = () => {
    const { id } = useParams();
    const url = `http://localhost:3000/news/tags?limit=10&page=1&tag=${id}`
    const [tag, setTag] = useState<Tag | null>(null)
    const { showToast } = useToast();

    useEffect(() => {
        fetch(`http://localhost:3000/tags/${id}`)
                .then((res) => res.json())
                .then((data: SingleTagRes) => {
                    setTag(data.tag)
                })
                .catch(() => showToast('Greška pri učitavanju taga', 'danger'));
    }, [id]);

    return (
        <div>
            <h1 style={{ padding: 30 }}>#Tag: {tag?.name}</h1>
            <NewsList url={url} />
        </div>
    )
};

export default TagPage;