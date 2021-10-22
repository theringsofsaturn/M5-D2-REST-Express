import express from "express"; // 3RD PARTY MODULE (does need to be installed)
import fs from "fs-extra"; // CORE MODULE (doesn't need to be installed)

import { fileURLToPath } from "url"; // CORE MODULE (doesn't need to be installed)

import { dirname, join } from "path"; // CORE MODULE (doesn't need to be installed)

// Get random unique ID
import uniqid from "uniqid"; // 3RD PARTY MODULE (Needs to be installed)

// Handle all status code error messages with this package
import createHttpError from "http-errors";

import { authorsValidationMiddleware } from "./validation.js";

import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const authorAvatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "authors",
  },
});

// Functions stored into a variable to read & write
import {
  readAuthors,
  writeAuthors,
  authorsAvatarPic,
} from "../../lib/tools.js";
import { nextTick } from "process";

const authorsRouter = express.Router(); // a Router is a set of endpoints that share something like a prefix (authorsRouter is going to share /authors as a prefix)

// READ --> GET http:localhost:3001/authors + (Optional Query Parameters) => returns the list of authors
// READ --> GET /authors/123 => returns a single author
// CREATE --> POST /authors (+body) => create a new author
// UPDATE --> PUT /authors/123 (+ body) => edit the author with the given id
// DELETE --> DELETE /authors/123 => delete the author with the given id

// ********************* how to find out the path *************
// 1. I'll start from the current file I'm in right now (C://......./authors/index.js) and I'll get the path to that file
// import.meta.url give us info about the url of the current module
// fileURLToPath converts that url into a path
// const currentFilePath = fileURLToPath(import.meta.url);

// 2. I'll get the parent folder's path
// dirname extracts the directory name from the specified path
// const currentDir = dirname(currentFilePath);
// const currentDir = dirname(fileURLToPath(import.meta.url))

// 3. I can concatenate the directory path with authors.json file
// join is the safest way to concatenate two paths together regardless of what OS are you executing the application from
// const authorsJsonPath = join(currentDir, "authors.json"); // DO NOT EVER USE '+' TO CONCATENATE TWO PATHS, USE JOIN INSTEAD
// console.log(authorsJsonPath);

//Get all the authors / Return the list of authors
authorsRouter.get("/", async (req, res, next) => {
  try {
    // Read the file content obtaining the authors array. It converts from machine language to JSON
    const authors = await readAuthors(); // --> JSON.parse(fs.readFileSync(authorsJsonPath));

    // Send back a proper response (whole body)
    res.status(200).send(authors);
  } catch (error) {
    next(error);
  }
});

// Get specific author matching an ID / Returns a single author
authorsRouter.get("/:authorsId", async (req, res, next) => {
  try {
    const authors = await readAuthors(); // JSON.parse(fs.readFileSync(authorsJsonPath));

    // filter the author with that specific id
    const filteredAuthor = authors.find(
      (authors) => authors.id === req.params.authorsId
    );

    if (filteredAuthor) {
      res.send(filteredAuthor);
    } else {
      next(
        createError(404, `Author with id ${req.params.authorsId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }

  // send a proper response
  res.status(200).send(filteredAuthors);
});

//Create a new author
// POST
authorsRouter.post("/", authorsValidationMiddleware, async (req, res, next) => {
  const objModel = {
    name: "",
    surname: "",
    email: "",
    dateOfBirth: "",
  };
  try {
    const newAvatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`;
    const newAuthor = {
      _id: uniqid(),
      ...objModel,
      ...req.body,
      avatar: newAvatar,
      createdAt: new Date(),
    };

    const authors = await readAuthors();

    authors.push(newAuthor);

    await writeAuthors(authors);

    res.status(201).send({ _id: newAuthor._id });
  } catch (error) {
    next(error);
  }
});

// Upload author's avatar
// POST
authorsRouter.post(
  "/:authorsId/uploadAvatar",
  multer().single("avatar"),
  async (req, res) => {
    console.log(req.body);

    try {
      const extension = extname(req.file.originalname);
      await authorsAvatarPic(req.params.authorsId + extension, req.file.buffer);

      const authors = await readAuthors();

      const authorsUrl = authors.find(
        (blog) => blog.id === req.params.authorsId
      );

      const avatarUrl = `http://localhost:3001/img/authors/${req.params.authorsId}${extension}`;
      authorsUrl.avatar = avatarUrl;
      const authorsArray = authors.filter(
        (blogs) => blogs.id !== req.params.authorsId
      );
      authorsArray.push(authorsUrl);
      await writeAuthors(authorsArray);
      res.send(200);
    } catch (error) {
      nextTick(error);
    }
  }
);

// Check email
// POST
authorsRouter.post("/checkEmail", async (req, res) => {
  const authors = await readAuthors();

  if (authors.filter((author) => author.email === req.body.email).length > 0) {
    res.status(403).send({ succes: false, data: "User already exists" });
  } else {
    res.status(201).send({ succes: true });
  }
});

//Modify a specific author that has the matching Id
// PUT
authorsRouter.put("/:authorsId", async (req, res) => {
  //read all the authors
  const authors = readAuthors(); // JSON.parse(fs.readFileSync(authorsJsonPath));

  //find the author
  const indexOfAuthor = authors.findIndex(
    (authors) => authors.id === req.params.authorsId
  );

  // copying the body content and overwriting some parts with what is sent with the request by the client
  const updateAuthor = { ...authors[indexOfAuthor], ...req.body };

  authors[indexOfAuthor] = updateAuthor;

  //writing the changes on the disk
  await writeAuthors(authors); // fs.writeFileSync(authorsJsonPath, JSON.stringify(authors));

  res.send(updateAuthor);
});

//Delete a specific author that has the matching Id
authorsRouter.delete("/:authorsId", async (req, res) => {
  //read the body content
  const authors = await readAuthors(); // JSON.parse(fs.readFileSync(authorsJsonPath));

  const authorsArray = authors.filter(
    (authors) => authors.id !== req.params.authorsId
  );

  //writing on the disk all the authors apart from the deleted one
  await writeAuthors(authorsArray); // fs.writeFileSync(authorsJsonPath, JSON.stringify(authorsArray));

  res.status(204).send();
});

export default authorsRouter;
