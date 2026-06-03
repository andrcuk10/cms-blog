import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

const SingleNews = (props: any) => {
    const id = props.post?.id ?? null;
    const categories = props.categories
    

    const [formData, setFormData] = useState({
        title: props.post?.title ?? "",
        text: props.post?.text ?? "",
        categoryId: props.post?.category?.id ?? "",
        tags: props.post?.tags?.map((tag: any) => tag.name).join(" ") ?? "",
    });

    // resetuj formu kad se post prop promeni
    useEffect(() => {
        setFormData({
            title: props.post?.title ?? "",
            text: props.post?.text ?? "",
            categoryId: props.post?.category?.id ?? "",
            tags: props.post?.tags?.map((tag: any) => tag.name).join(" ") ?? "",
        });
    }, [props.post]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.onUpdate({
            id,
            title: formData.title,
            text: formData.text,
            categoryId: formData.categoryId,
            tags: formData.tags
                .split(" ")
                .map((t: string) => t.trim())
                .filter((t: string) => t !== ""),
        });

        
    };

    return (
        <Form onSubmit={handleSubmit}>
            {id ? <h3>Izmeni vest</h3> : <h3>Dodaj vest</h3>}

            <Form.Group className="mb-3">
                <Form.Label>Naslov</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Kategorija</Form.Label>
                <Form.Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Izaberi kategoriju</option>
                    {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Tekst</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Tagovi</Form.Label>
                <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="sport politika kultura"
                />
                <Form.Text className="text-muted">
                    Unesi tagove razdvojene razmakom
                </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
                Sačuvaj izmene
            </Button>
        </Form>
    );
};

export default SingleNews;