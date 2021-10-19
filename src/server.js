import express from "express";

const server = express();

server.use(express.json());
// If I do NOT specify this line BEFORE the endpoints all the requests' bodies will be UNDEFINED

// ************* ENDPOINTS *****************

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
