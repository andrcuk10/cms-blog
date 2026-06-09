import { useParams } from "react-router-dom";
import NewsList from "../components/NewsList";

const SearchNewsPage = () => {
    const { searchItem } = useParams();
    const url = `http://localhost:3000/news?limit=10&page=1&search=${searchItem}`
    
    return (
        <div>
            <h1 style={{ padding: 30 }}>#Pretraga: {searchItem}</h1>
            <NewsList key={url} url={url} />
        </div>
    )
};

export default SearchNewsPage;