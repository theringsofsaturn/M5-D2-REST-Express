import express from "express"; // 3RD PARTY MODULE (does need to be installed)
import fs from "fs"; // CORE MODULE (doesn't need to be installed)

import { fileURLToPath } from "url"; // CORE MODULE (doesn't need to be installed)

import { dirname, join } from "path"; // CORE MODULE (doesn't need to be installed)

// Get random unique ID
import uniqid from "uniqid"; // 3RD PARTY MODULE (Needs to be installed)

const authorsRouter = express.Router(); // a Router is a set of endpoints that share something like a prefix (authorsRouter is going to share /authors as a prefix)

// READ --> GET http:localhost:3001/authors + (Optional Query Parameters) => returns the list of authors
// READ --> GET /authors/123 => returns a single author
// CREATE --> POST /authors (+body) => create a new author
// UPDATE --> PUT /authors/123 (+ body) => edit the author with the given id
// DELETE --> DELETE /authors/123 => delete the author with the given id

// ********************* how to find out the path *************
// 1. I'll start from the current file I'm in right now (C://......./authors/index.js) and I'll get the path to that file
//import.meta.url give us info about the url of the current module
//fileURLToPath converts that url into a path
const currentFilePath = fileURLToPath(import.meta.url);

// 2. I'll get the parent folder's path
//dirname extracts the directory name from the specified path
const parentFolderPath = dirname(currentFilePath);
// const currentDir = dirname(fileURLToPath(import.meta.url))

// 3. I can concatenate the parent's folder path with authors.json
//join is the safest way to concatenate two paths together regardless of what OS are you executing the application from
const authorsJsonPath = join(parentFolderPath, "authors.json"); // DO NOT EVER USE '+' TO CONCATENATE TWO PATHS, USE JOIN INSTEAD
console.log(authorsJsonPath);

//Get all the authors
authorsRouter.get("/", (req, res) => {
  // Read the file content obtaining the authors array. It converts from machine language to JSON
  const authors = JSON.parse(fs.readFileSync(authorsJsonPath));

  console.log(authors);

  //Send back a proper response (whole body)
  res.status(200).send(authors);
});

//Get specific author matching an ID
// GET
authorsRouter.get("/:authorsId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJsonPath));

  //filter the author with that specific id
  const filteredAuthors = authors.find(
    (authors) => authors.id === req.params.authorsId
  );

  console.log(req.params.authorsId);

  // send a proper response
  res.status(200).send(filteredAuthors);
});

//Create a unique author with an Id
// POST
authorsRouter.post("/", (req, res) => {
  console.log(req.body);

  //spreading (copying) the whole body of the request that was sent, then add an id and a date created
  const createAuthor = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
  };

// Read the file content 
  const authors = JSON.parse(fs.readFileSync(authorsJsonPath));

  console.log(
    authors.filter((author) => author.email === req.body.email).length > 0
  );

  if (authors.filter((author) => author.email === req.body.email).length > 0) {
    res.status(403).send({ succes: false, data: "User already exists" });
    return;
  }

  authors.push(createAuthor);

  //writing the changes on the disk
  fs.writeFileSync(authorsJsonPath, JSON.stringify(authors));

  res.status(201).send({ id: authors.id });
});

//Modify a specific author that has the matching Id
// PUT
authorsRouter.put("/:authorsId", (req, res) => {
  //read all the authors
  const authors = JSON.parse(fs.readFileSync(authorsJsonPath));

  //find the author
  const indexOfAuthor = authors.findIndex(
    (authors) => authors.id === req.params.authorsId
  );

  //spreading the old body content and replacing some parts or everything with the request sent by the client
  const updateAuthor = { ...authors[indexOfAuthor], ...req.body };

  authors[indexOfAuthor] = updateAuthor;

  //writing the changes on the disk
  fs.writeFileSync(authorsJsonPath, JSON.stringify(authors));

  res.send(updateAuthor);
});

//Delete a unique author that has the matching Id
authorsRouter.delete("/:authorsId", (req, res) => {
  //read the body content
  const authors = JSON.parse(fs.readFileSync(authorsJsonPath));

  const authorsArray = authors.filter(
    (authors) => authors.id !== req.params.authorsId
  );

  //writing on the disk all the authors but not the deleted one
  fs.writeFileSync(authorsJsonPath, JSON.stringify(authorsArray));

  res.status(204).send();
});

// /// 1.
// authorsRouter.post("/", (req, res) => {
//   // First parameter is relative URL, second parameter is the REQUEST HANDLER

//   // 1. Read the request body obtaining the new author's data
//   console.log(req.body);

//   const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };
//   console.log(newAuthor);

//   // 2. Read the file content obtaining the authors array
//   const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

//   // 3. Add new author to the array
//   authors.push(newAuthor);

//   // 4. Write the array back to the file
//   fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

//   // 5. Send back a proper response

//   res.status(201).send({ id: newAuthor.id });
// });

// // 2.
// authorsRouter.get("/", (req, res) => {
//   // 1. Read the content of authors.json file

//   const fileContent = fs.readFileSync(authorsJSONPath); // You are getting back the file content in the form of a BUFFER (machine readable)

//   console.log(JSON.parse(fileContent));

//   const arrayOfauthors = JSON.parse(fileContent); // JSON.parse is translating buffer into a real JS array
//   // 2. Send it back as a response
//   res.send(arrayOfauthors);
// });

// // 3.
// authorsRouter.get("/:authorId", (req, res) => {
//   // 1. Read the content of authors.json file (obtaining an array)

//   const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

//   // 2. Find the user by id in the array

//   const author = authors.find((author) => author.id === req.params.authorId); // in the req.params I need to use the exact same name I have used in the "placeholder" in the URL

//   // 3. Send the user as a response

//   res.send(author);
// });

// // 4.
// authorsRouter.put("/:authorId", (req, res) => {
//   // 1. Read authors.json obtaining an array of authors
//   const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

//   // 2. Modify the specified author
//   const index = authors.findIndex(
//     (author) => author.id === req.params.authorId
//   );

//   const updatedauthor = { ...authors[index], ...req.body };

//   authors[index] = updatedauthor;

//   // 3. Save the file with updated list of authors
//   fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

//   // 4. Send back a proper response

//   res.send(updatedauthor);
// });

// // 5.
// authorsRouter.delete("/:authorId", (req, res) => {
//   // 1. Read authors.json obtaining an array of authors
//   const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

//   // 2. Filter out the specified author from the array, keeping just the remaining authors
//   const remainingauthors = authors.filter(
//     (author) => author.id !== req.params.authorId
//   ); // ! = =

//   // 3. Save the remaining authors into authors.json file again
//   fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingauthors));

//   // 4. Send back a proper response
//   res.status(204).send();
// });

export default authorsRouter;
