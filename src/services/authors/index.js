import express from "express"

// a Router is a set of endpoints that share something like a prefix (authorsRouter is going to share /authors as a prefix)
const authorsRouter = express.Router();



export default authorsRouter;
