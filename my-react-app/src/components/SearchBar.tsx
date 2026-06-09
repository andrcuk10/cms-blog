import { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Search } from "react-bootstrap-icons";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!query.trim()) return;
        navigate(`/public/news/search/${query}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <InputGroup style={{ width: "250px" }}>
            <Form.Control
                type="text"
                placeholder="Pretraži vesti..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button variant="outline-light" onClick={handleSearch}>
                <Search />
            </Button>
        </InputGroup>
    );
};

export default SearchBar;