import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

const SingleUser = (props: any) => {
    const id = props.user?.id ?? null;

    const [formData, setFormData] = useState({
        first_name: props.user?.first_name ?? "",
        last_name: props.user?.last_name ?? "",
        email: props.user?.email ?? "",
        role: props.user?.role ?? "creator",
        password: "",
        confirm_password: "",
    });

    useEffect(() => {
        setFormData({
            first_name: props.user?.first_name ?? "",
            last_name: props.user?.last_name ?? "",
            email: props.user?.email ?? "",
            role: props.user?.role ?? "creator",
            password: "",
            confirm_password: "",
        });
    }, [props.user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            props.onUpdate({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                role: formData.role,
                password: formData.password,
                confirm_password: formData.confirm_password,
            });
        } else {
            props.onUpdate({
                id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                role: formData.role,
            });
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {id ? <h3>Izmeni korisnika</h3> : <h3>Dodaj korisnika</h3>}

            <Form.Group className="mb-3">
                <Form.Label>Ime</Form.Label>
                <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Prezime</Form.Label>
                <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Tip korisnika</Form.Label>
                <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                </Form.Select>
            </Form.Group>

            {!id && (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Lozinka</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Potvrda lozinke</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </>
            )}

            <Button variant="primary" type="submit">
                Sačuvaj izmene
            </Button>
        </Form>
    );
};

export default SingleUser;