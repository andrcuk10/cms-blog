import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { NewsDTO, Comment, NewCommentRes } from "../utils/response";
import { Badge, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";

const SingleNewsPage = () => {
    const { id } = useParams();

    const [news, setNews] = useState<NewsDTO | null>(null);
    const [commentForm, setCommentForm] = useState({ author: "", text: "" });
    const [votedNews, setVotedNews] = useState<Record<string, "like" | "dislike">>(() => {
        const stored = localStorage.getItem("votedNews");
        return stored ? JSON.parse(stored) : {};
    });
    const [visitedNews] = useState<string[]>(() => {
        const stored = localStorage.getItem("visitedNews");
        return stored ? JSON.parse(stored) : [];
    });
    const [votedComments, setVotedComments] = useState<Record<string, "like" | "dislike">>(() => {
    const stored = localStorage.getItem("votedComments");
        return stored ? JSON.parse(stored) : {};
    });

    const { showToast } = useToast();

    useEffect(() => {
        fetch(`http://localhost:3000/news/${id}`)
            .then((res) => res.json())
            .then((data) => {
                const sorted = [...data.news.comments].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setNews({ ...data.news, comments: sorted });

                if (id && !visitedNews.includes(id)) {
                    fetch(`http://localhost:3000/news/${id}/visit`, { method: "POST" })
                        .then(() => {
                            const updated = [...visitedNews, id];
                            localStorage.setItem("visitedNews", JSON.stringify(updated));
                        })
                        .catch(() => showToast('Greška pri belezenju poseta', "danger"));
                }
            })
            .catch(() => showToast('Greška pri učitavanju vesti', "danger"));
    }, [id]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCommentForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/news/${id}/comments`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(commentForm)
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            showToast('Uspesno dodat komentar', "success")

            const result: NewCommentRes = await response.json()
            const newComment: Comment = {
                id: result.comment_id,
                author: commentForm.author,
                text: commentForm.text,
                like: 0,
                dislike: 0,
                createdAt: new Date().toISOString()
            }

            setNews((prev) =>
                prev ? { ...prev, comments: [newComment, ...prev.comments] } : prev
            );
            setCommentForm({ author: "", text: "" });
        } catch(err) {
            showToast('Greška pri dodavanju komentara', "danger")
        }
    };

    const handleNewsVote = async (type: "like" | "dislike") => {
        if (!id || votedNews[id]) return;

        try {
            const response = await fetch(`http://localhost:3000/news/${id}/${type}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(commentForm)
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const updated = { ...votedNews, [id]: type };
            setVotedNews(updated);
            localStorage.setItem("votedNews", JSON.stringify(updated));
            setNews((prev) => {
                if (!prev) return prev;
                return { ...prev, [type]: prev[type] + 1 };
            });
        } catch(err) {
            showToast('Greška pri glasanju za vest', "danger")
        }
    };

    const handleVote = async (commentId: string, type: "like" | "dislike") => {
        if (votedComments[commentId]) return;

        try {
            const response = await fetch(`http://localhost:3000/news/comments/${commentId}/${type}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                },
            })

            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const updated = { ...votedComments, [commentId]: type };
            setVotedComments(updated);
            localStorage.setItem("votedComments", JSON.stringify(updated));
            setNews((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    comments: prev.comments.map((c) =>
                        c.id === commentId ? { ...c, [type]: c[type] + 1 } : c
                    ),
                };
            });
        } catch(err) {
            showToast('Greška pri glasanju komentara', "danger")
        }
    };

    const navigate = useNavigate()
    const handleTagClick = (id: string) => {
        navigate(`/public/tags/${id}`);
    };

    if (!news) return <p>Učitavanje...</p>;

    return (
        <div className="container py-4">
            <h2>{news.title}</h2>
            <p className="text-muted">
                {news.author.first_name} {news.author.last_name} ·{" "}
                {new Date(news.createdAt).toLocaleDateString("sr-RS")}
            </p>

            <div className="mb-3">
                {news.tags.map((tag) => (
                    <Badge key={tag.id} bg="secondary" className="me-1" style={{ cursor: 'pointer' }} onClick={(e) => handleTagClick(tag.id)}>
                        {tag.name}
                    </Badge>
                ))}
            </div>

            <p>{news.text}</p>

            <div className="d-flex gap-2 mb-3">
                <Button
                    variant={votedNews[id!] === "like" ? "success" : "outline-success"}
                    size="sm"
                    onClick={() => handleNewsVote("like")}
                    disabled={!!votedNews[id!]}
                >
                    👍 {news.like}
                </Button>
                <Button
                    variant={votedNews[id!] === "dislike" ? "danger" : "outline-danger"}
                    size="sm"
                    onClick={() => handleNewsVote("dislike")}
                    disabled={!!votedNews[id!]}
                >
                    👎 {news.dislike}
                </Button>
            </div>
            <hr />

            <h5>Dodaj komentar</h5>
            <Form onSubmit={handleCommentSubmit} className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Ime</Form.Label>
                    <Form.Control
                        type="text"
                        name="author"
                        value={commentForm.author}
                        onChange={handleCommentChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Komentar</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="text"
                        value={commentForm.text}
                        onChange={handleCommentChange}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary">Objavi</Button>
            </Form>

            <h5>Komentari</h5>
            {news.comments.length === 0 && <p className="text-muted">Nema komentara.</p>}
            {news.comments.map((comment) => (
                <Card key={comment.id} className="mb-3">
                    <Card.Body>
                        <Card.Subtitle className="mb-2 text-muted">
                            {comment.author} · {new Date(comment.createdAt).toLocaleDateString("sr-RS")}
                        </Card.Subtitle>
                        <Card.Text>{comment.text}</Card.Text>
                        <div className="d-flex gap-2">
                            <Button
                                variant={votedComments[comment.id] === "like" ? "success" : "outline-success"}
                                size="sm"
                                onClick={() => handleVote(comment.id, "like")}
                                disabled={!!votedComments[comment.id]}
                            >
                                👍 {comment.like}
                            </Button>
                            <Button
                                variant={votedComments[comment.id] === "dislike" ? "danger" : "outline-danger"}
                                size="sm"
                                onClick={() => handleVote(comment.id, "dislike")}
                                disabled={!!votedComments[comment.id]}
                            >
                                👎 {comment.dislike}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default SingleNewsPage;