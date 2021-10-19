// OLD IMPORT SYNTAX const express = require("express")
import express from "express"; // NEW IMPORT SYNTAX
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./services/authors";

const server = express();

server.use(express.json());
// If I do NOT specify this line BEFORE the endpoints all the requests' bodies will be UNDEFINED

// ************* ENDPOINTS *****************

// all of the endpoints which are in the authorsRouter will have /authors as a prefix
server.use("/authors", authorsRouter);

console.table(listEndpoints(server))
const port = 3001

server.listen(port, () => {
  console.log("Server is running on port: ", port);
});
