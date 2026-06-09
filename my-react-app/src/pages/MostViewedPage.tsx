import NewsList from "../components/NewsList";

const MostViewedPage = () => {

    return (
        <div>
            <h1 style={{ padding: 30 }}>Najcitanije vesti</h1>
            <NewsList url="http://localhost:3000/news/most-viewed" />
        </div>
    )
};

export default MostViewedPage;