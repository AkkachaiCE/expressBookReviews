const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop (Task 10)
const allBooks = new Promise((resolve, reject) => {
  if (Object.keys(books).length > 0) {
    resolve(books);
  } else {
    reject(err)
  }
});
public_users.get('/',function (req, res) {
  allBooks.then(function(books) {
    return res.status(200).json({message: JSON.stringify(books,null,4)})
  }).catch(function(err) {
    return res.status(300).json({message: "There is error"})
  });
  //Write your code here
  //res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Get the book list available in the shop"});
});

// Get book details based on ISBN (Task 11)
public_users.get('/isbn/:isbn',function (req, res) {
  allBooks.then(function(books) {
    let isbn = req.params.isbn;
    if (isbn) {
      return res.status(200).json(books[isbn]);
    }
    }).catch(function(err) {
      return res.status(300).json({message: "There is error"})
    })
  //Write your code here
  //const isbn = req.params.isbn;
  //res.send(books[isbn])
  //return res.status(300).json({message: "Get book details based on ISBN"});
 });
  
// Get book details based on author (Task 12)
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const books_Author = [];
  const bookfromAuthor = new Promise(function(resolve,reject) {
    for (const isbn in books) {
      const book = books[isbn];
      if (book.author === author) {
        books_Author.push(book);
      }
    }
    if (books_Author.length > 0) {
      resolve(books_Author);
    } else {
      reject(err);
    }
  });

  bookfromAuthor.then(function(result) {
    return res.status(200).json({message: result});
  }).catch(function(err) {
    return res.status(300).json({message: "There is no book"})
  })
  //for (let i = 1; i<10; i++) {
   // if (books[i].author === author) {
       // res.send(books[i]);
    //}
  //}
  //return res.status(300).json({message: "Get book details based on author"});
});

// Get all books based on title (Task 13)
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const book_Title = [];
  const bookfromTitle = new Promise(function(resolve, reject) {
    for (const isbn in books) {
      const book = books[isbn];
      if (book.title === title) {
        book_Title.push(book);
      }
    }
    if (book_Title.length > 0) {
      resolve(book_Title);
    } else {
      reject(err)
    }
  });
  bookfromTitle.then(function(result) {
    return res.status(200).json({message: result});
  }).catch(function(err)) {
    return res.status(300).json({message: "There is no book"})
  }
  //for (let i = 1; i<10; i++) {
    //if (books[i].title === title) {
        //res.send(books[i]);
    //}
  //}
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]
  res.send(book.reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});


module.exports.general = public_users;
