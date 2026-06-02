import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

const SingleSubject = (props: any) => {
    const id = props.category?.id ?? null;

    const [formData, setFormData] = useState({
        name: props.category?.name ?? "",
        description: props.category?.description ?? "",
    });

    useEffect(() => {
        setFormData({
            name: props.category?.name ?? "",
            description: props.category?.description ?? "",
        });
    }, [props.category]); // kad se category prop promeni, resetuj formu

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.onUpdate({ name: formData.name, description: formData.description, id });
    };

    return (
        <Form onSubmit={handleSubmit}>
            {id ? (
                <h3>Izmeni kategoriju</h3>
            ) : (
                <h3>Dodaj kategoriju</h3>
            )}
            
            <Form.Group className="mb-3">
                <Form.Label>Naziv</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Opis</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Sačuvaj izmene
            </Button>
        </Form>
    );
};

export default SingleSubject;