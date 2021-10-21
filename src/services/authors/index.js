import express from "express"; // 3RD PARTY MODULE (does need to be installed)
import fs from "fs-extra"; // CORE MODULE (doesn't need to be installed)

import { fileURLToPath } from "url"; // CORE MODULE (doesn't need to be installed)

import { dirname, join } from "path"; // CORE MODULE (doesn't need to be installed)

// Get random unique ID
import uniqid from "uniqid"; // 3RD PARTY MODULE (Needs to be installed)
import { readAuthors, writeAuthors, authorsAvatarPic } from "../../lib/tools";

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
const currentDir = dirname(currentFilePath);
// const currentDir = dirname(fileURLToPath(import.meta.url))

// 3. I can concatenate the directory path with authors.json file
//join is the safest way to concatenate two paths together regardless of what OS are you executing the application from
const authorsJsonPath = join(currentDir, "authors.json"); // DO NOT EVER USE '+' TO CONCATENATE TWO PATHS, USE JOIN INSTEAD
console.log(authorsJsonPath);

//Get all the authors
authorsRouter.get("/", async (req, res) => {
  // Read the file content obtaining the authors array. It converts from machine language to JSON
  const authors = readAuthors(); // --> JSON.parse(fs.readFileSync(authorsJsonPath));

  console.log(authors);

  //Send back a proper response (whole body)
  res.status(200).send(authors);
});

//Get specific author matching an ID
// GET
authorsRouter.get("/:authorsId", async (req, res) => {
  const authors = await readAuthors(); // JSON.parse(fs.readFileSync(authorsJsonPath));

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
authorsRouter.post("/", async (req, res) => {
  console.log(req.body);

  //spreading (copying) the whole body of the request that was sent, then add an id and a date created
  const createAuthor = {
    ...req.body,
    createdAt: new Date(),
    id: uniqid(),
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
  };

  // Read the file content
  const authors = await readAuthors(); // JSON.parse(fs.readFileSync(authorsJsonPath));

  console.log(
    authors.filter((author) => author.email === req.body.email).length > 0
  );

  if (authors.filter((author) => author.email === req.body.email).length > 0) {
    res.status(403).send({ succes: false, data: "User already exists" });
    return;
  }

  authors.push(createAuthor);

  //writing the changes on the disk
  await writeAuthors(authors); // fs.writeFileSync(authorsJsonPath, JSON.stringify(authors));

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

  // copying the body content and overwriting some parts with what is sent with the request by the client
  const updateAuthor = { ...authors[indexOfAuthor], ...req.body };

  authors[indexOfAuthor] = updateAuthor;

  //writing the changes on the disk
  fs.writeFileSync(authorsJsonPath, JSON.stringify(authors));

  res.send(updateAuthor);
});

//Delete a specific author that has the matching Id
authorsRouter.delete("/:authorsId", (req, res) => {
  //read the body content
  const authors = JSON.parse(fs.readFileSync(authorsJsonPath));

  const authorsArray = authors.filter(
    (authors) => authors.id !== req.params.authorsId
  );

  //writing on the disk all the authors apart from the deleted one
  fs.writeFileSync(authorsJsonPath, JSON.stringify(authorsArray));

  res.status(204).send();
});

export default authorsRouter;
