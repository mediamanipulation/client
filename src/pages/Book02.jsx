import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Books02.css'; // Ensure you have a CSS file named Books.css in the same directory

const Books = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get('http://localhost:8800/books');
                setBooks(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllBooks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8800/books/${id}`);
            setBooks(books.filter(book => book.id !== id)); // Optimistic update for better UX
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="bookshop">
            <h1>Lama Book Shop</h1>
            <div className="books-grid">
            <button className="add-home">
                <Link to="/add" className="link-style">
                    Add new book
                </Link>
            </button>
                {books.map((book) => (
                    <div key={book.id} className="book-item">
                        
                        <div className="book-details">
                        <img src={book.cover} alt={book.title} className="book-cover" />
                            <div className="book-info">
                                <h2>{book.title}</h2>
                                <p>{book.desc}</p>
                                <span>${book.price}</span>
                            </div>
                            
                        </div>
                        <div className="book-actions">
                                <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
                                <button className="update">
                                    <Link to={`/update/${book.id}`} className="link-style">
                                        Update
                                    </Link>
                                </button>
                            </div>
                    </div>
                ))}
            </div>
            <button className="add-home">
                <Link to="/add" className="link-style">
                    Add new book
                </Link>
            </button>
        </div>
    );
};

export default Books;
