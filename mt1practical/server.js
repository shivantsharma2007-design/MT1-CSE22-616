
const express = require("express");

const app = express();
app.use(express.json());

let books = [];
let nextId = 1;

// 1. POST - Add a new book
app.post("/api/books", (req, res) => {
    const { title, author, year } = req.body;

    if (!title || !author || year === undefined || typeof year !== "number") {
        return res.status(400).json({
            message: "Missing or invalid data"
        });
    }

    const exists = books.find(
        book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: "Book already exists"
        });
    }

    const newBook = {
        id: nextId++,
        title,
        author,
        year
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});


// 2. GET - Get all books (with author filter)
app.get("/api/books", (req, res) => {
    const { author } = req.query;

    if (author) {
        const filteredBooks = books.filter(
            book => book.author.toLowerCase() === author.toLowerCase()
        );

        return res.status(200).json(filteredBooks);
    }

    res.status(200).json(books);
});


// 3. GET - Get book by ID
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});


// 4. PUT - Update book by ID
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, author, year } = req.body;

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!title || !author || year === undefined || typeof year !== "number") {
        return res.status(400).json({
            message: "Missing or invalid data"
        });
    }

    const exists = books.find(
        b => b.id !== id && b.title.toLowerCase() === title.toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            message: "Book already exists"
        });
    }

    book.title = title;
    book.author = author;
    book.year = year;

    res.status(200).json({
        message: "Book updated successfully",
        book
    });
});


// 5. DELETE - Delete book by ID
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});


// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
