import NewsList from "../components/NewsList";

const HomePage = () => {

    return (
        <div>
            <h1 style={{ padding: 30 }}>Pocetna stranica</h1>
            <NewsList url="http://localhost:3000/news?limit=10&page=1" />
        </div>
    )
};

export default HomePage;