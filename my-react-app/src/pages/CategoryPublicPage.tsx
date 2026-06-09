import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { CategoryDTO, SingleCategoryRes } from "../utils/response";
import NewsList from "../components/NewsList";
import { useToast } from "../components/ToastContext";

const CategoryPublicPage = () => {
    const { id } = useParams();
    const url = `http://localhost:3000/news?limit=10&page=1&categoryId=${id}`
    const { showToast } = useToast();

    const [category, setCategory] = useState<CategoryDTO | null>(null);

    useEffect(() => {
            fetch(`http://localhost:3000/categories/${id}`)
                .then((res) => res.json())
                .then((data: SingleCategoryRes) => {
                    setCategory(data.category)
                })
                .catch(() => showToast('Greška pri učitavanju kategorije', "danger"));
        }, [id]);

    return (
        <div>
            <h1>{category?.name}</h1>
            <NewsList key={url} url={url} />
        </div>
    )
};

export default CategoryPublicPage;