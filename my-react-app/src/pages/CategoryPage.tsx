import React, { useState, useEffect } from "react";
import type { CategoryDTO, CategoryListingPage } from "../response";

const CategoryPage = () => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]); // Lista kategorija
    const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null); // Selektovana kategorija

    // Funkcija za skraćivanje teksta
    const shortText = (text: string) => (text.length < 30 ? text : text.slice(0, 30) + "...");

    // Učitavanje kategorije pri prvom renderovanju
    useEffect(() => {
        const fetchCateogies = async () => {
            try {
                const response = await fetch('http://localhost:3000/categories?limit=10&page=1', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                
                if(!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                const result: CategoryListingPage = await response.json()
                // console.log(result)
                // Strict mode moze da doprinese duplom pozivu zbog identifikacije promena
                setCategories(result.categories); // Postavljamo podatke u state
            } catch (error) {
                console.error("Greška prilikom učitavanja kategorije:", error);
            }
        };

        fetchCateogies();
    }, []);

    return (
        <>
          <h1>Category Page</h1>
        </>
    );
};

export default CategoryPage;