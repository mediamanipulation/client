import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Update = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: "", // Ensure all fields are initialized as strings
    cover: "",
  });

  const [error, setError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const bookId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/books/${bookId}`);
        if (response.data) { // Check if the book data exists
          setBook({
            ...response.data,
            price: response.data.price ? response.data.price.toString() : "", // Safeguard against null
          });
        } else {
          setError(true);
          console.error("Book not found");
        }
      } catch (err) {
        console.error("Error fetching book details:", err.response ? err.response.data : err.message);
        setError(true);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const updatedBook = {
      ...book,
      price: book.price ? parseFloat(book.price) : 0, // Handle price correctly
    };

    try {
      await axios.put(`http://localhost:8800/books/${bookId}`, updatedBook);
      navigate("/");
    } catch (err) {
      console.error("Error updating book:", err.response ? err.response.data : err.message);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Update the Book</h1>
      <input
        type="text"
        placeholder="Book title"
        name="title"
        value={book.title}
        onChange={handleChange}
      />
      <textarea
        rows={5}
        placeholder="Book desc"
        name="desc"
        value={book.desc}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Book price"
        name="price"
        value={book.price}
        onChange={handleChange}
      />
      <input
        type="text"
        placeholder="Book cover"
        name="cover"
        value={book.cover}
        onChange={handleChange}
      />
      <button onClick={handleClick}>Update</button>
      {error && <p>Something went wrong!</p>}
      <Link to="/">See all books</Link>
    </div>
  );
};

export default Update;
