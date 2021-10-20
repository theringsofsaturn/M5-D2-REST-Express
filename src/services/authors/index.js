import express from "express"; // 3RD PARTY MODULE (does need to be installed)
import fs from "fs"; // CORE MODULE (doesn't need to be installed)


import { fileURLToPath } from "url"; // CORE MODULE (doesn't need to be installed)



import { dirname, join } from "path"; // CORE MODULE (doesn't need to be installed)


// Get random unique ID
import uniqid from "uniqid"; // 3RD PARTY MODULE (does need to be installed)

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
const currentFilePath = fileURLToPath(import.meta.url)

// 2. I'll get the parent folder's path
//dirname extracts the directory name from the specified path
const parentFolderPath = dirname(currentFilePath)

// 3. I can concatenate the parent's folder path with authors.json 
//join is the safest way to concatenate two paths together
const authorsJSONPath = join(parentFolderPath, "authors.json") // DO NOT EVER USE '+' TO CONCATENATE TWO PATHS, USE JOIN INSTEAD
console.log(authorsJSONPath)

/// 1.
authorsRouter.post("/", (req, res) => {
    // First parameter is relative URL, second parameter is the REQUEST HANDLER
  
    // 1. Read the request body obtaining the new author's data
    console.log(req.body)
  
    const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() }
    console.log(newAuthor)
  
    // 2. Read the file content obtaining the authors array
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  
    // 3. Add new author to the array
    authors.push(newAuthor)
  
    // 4. Write the array back to the file
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
  
    // 5. Send back a proper response
  
    res.status(201).send({ id: newAuthor.id })
  })

  // 2.
authorsRouter.get("/", (req, res) => {
    // 1. Read the content of authors.json file
  
    const fileContent = fs.readFileSync(authorsJSONPath) // You are getting back the file content in the form of a BUFFER (machine readable)
  
    console.log(JSON.parse(fileContent))
  
    const arrayOfauthors = JSON.parse(fileContent) // JSON.parse is translating buffer into a real JS array
    // 2. Send it back as a response
    res.send(arrayOfauthors)
  })
  
  // 3.
  authorsRouter.get("/:authorId", (req, res) => {
    // 1. Read the content of authors.json file (obtaining an array)
  
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  
    // 2. Find the user by id in the array
  
    const author = authors.find(s => s.id === req.params.authorId) // in the req.params I need to use the exact same name I have used in the "placeholder" in the URL
  
    // 3. Send the user as a response
  
    res.send(author)
  })
  
  // 4.
  authorsRouter.put("/:authorId", (req, res) => {
    // 1. Read authors.json obtaining an array of authors
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  
    // 2. Modify the specified author
    const index = authors.findIndex(author => author.id === req.params.authorId)
  
    const updatedauthor = { ...authors[index], ...req.body }
  
    authors[index] = updatedauthor
  
    // 3. Save the file with updated list of authors
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
  
    // 4. Send back a proper response
  
    res.send(updatedauthor)
  })
  
  // 5.
  authorsRouter.delete("/:authorId", (req, res) => {
    // 1. Read authors.json obtaining an array of authors
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  
    // 2. Filter out the specified author from the array, keeping just the remaining authors
    const remainingauthors = authors.filter(author => author.id !== req.params.authorId) // ! = =
  
    // 3. Save the remaining authors into authors.json file again
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingauthors))
  
    // 4. Send back a proper response
    res.status(204).send()
  })

export default authorsRouter;
