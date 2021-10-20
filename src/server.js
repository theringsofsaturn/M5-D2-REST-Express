// OLD IMPORT SYNTAX const express = require("express")
import express from "express"; // NEW IMPORT SYNTAX
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import authorsRouter from "./services/authors/index.js"
import blogRouter from "./services/blog/index.js";

// import {
//   notFoundError,
//   badRequestError,
//   forbidenError,
//   genericServerError,
// } from "./errorHandlers.js"

// the server on the localhost por 3001 stored in a variable
const server = express();
const port = 3001

// ************* MIDDLEWARES ****************

const loggerMiddleware = (req, res, next) => {
  console.log(`Req method ${req.method} -- Req URL ${req.url} -- Created at ${new Date()}`)
  next()
}

server.use(loggerMiddleware)

//cors and express are middlewares
server.use(cors()) //cors connects Frontend with Backend
server.use(express.json()); // If I do NOT specify this line BEFORE the endpoints all the requests' bodies will be UNDEFINED


// ************* ENDPOINTS *****************

// all of the endpoints which are in the authorsRouter will have /authors as a prefix
server.use("/authors", authorsRouter);
server.use("/blogPosts", blogRouter)

console.table(listEndpoints(server))

// server.use(notFoundError)
// server.use(badRequestError)
// server.use(forbidenError)
// server.use(genericServerError)

server.listen(port, () => {
  console.log("Server is running on port: ", port);
});
