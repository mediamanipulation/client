import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Assuming the base URL is set in your environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8800";

const fetchBookDetails = async (bookId) => {
  const response = await axios.get(`${API_BASE_URL}/books/${bookId}`);
  return response.data;
};

const updateBookDetails = async (bookId, updatedBook) => {
  await axios.put(`${API_BASE_URL}/books/${bookId}`, updatedBook);
};

const Update = () => {
  const [book, setBook] = useState({ title: "", desc: "", price: "", cover: "" });
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const bookId = location.pathname.split("/")[2];

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const data = await fetchBookDetails(bookId);
        setBook({
          ...data,
          price: data.price ? data.price.toString() : "",
        });
      } catch (error) {
        setError("Failed to fetch book details. Please try again later.");
      }
    };

    getBookDetails();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const validateBook = () => {
    // Basic validation example
    if (!book.title || !book.desc || isNaN(book.price) || book.price < 0) {
      setError("Please fill in all fields correctly.");
      return false;
    }
    return true;
  };

  // format as money $000.00
  const formatMoney = (amount) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };


  const handleClick = async (e) => {
    e.preventDefault();
    if (!validateBook()) return;

    try {
      await updateBookDetails(bookId, {
        ...book,
        price: parseFloat(book.price),
      });
      navigate("/");
    } catch (error) {
      setError("Failed to update the book. Please try again later.");
    }
  };

  return (
    <div className="form">
      <h1>Update the Book</h1>
      <input type="text" placeholder="Book title" name="title" value={book.title} onChange={handleChange} />
      <textarea rows={5} placeholder="Book description" name="desc" value={book.desc} onChange={handleChange} />
      <input type="number" placeholder="Book price" name="price" value={book.price} onChange={handleChange} />
      <input type="text" placeholder="Book cover URL" name="cover" value={book.cover} onChange={handleChange} />
      <button onClick={handleClick}>Update</button>
      {error && <p className="error">{error}</p>}
      <Link to="/">See all books</Link>
    </div>
  );
};

export default Update;
