import express from "express";
import uniqid from "uniqid";
import fs from "fs"; // CORE MODULE (doesn't need to be installed)
import { fileURLToPath } from "url"; // CORE MODULE (doesn't need to be installed)

import { dirname, join } from "path"; // CORE MODULE (doesn't need to be installed)

const blogRouter = express.Router();

//import.meta.url give us info about the url of the current module
//fileURLToPath converts that url into a path
const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
// const currentDir = dirname(fileURLToPath(import.meta.url))

const blogPostsJSONPath = join(currentDir, "blog.json");

//GET
blogRouter.get("/", (req, res) => {
  const blogPosts = JSON.parse(fs.readFileSync(blogPostsJSONPath));
  //Send back a proper response 
  res.status(200).send(blogPosts);
});

// //Get specific blog posts matching an ID
// GET 
blogRouter.get("/:blogPostsId", (req, res) => {
    const blogPosts = JSON.parse(fs.readFileSync(blogPostsJSONPath));
  
    //filter the blog posts with that specific id
    const filteredblogPosts = blogPosts.find(
      (blogPosts) => blogPosts.id === req.params.blogPostsId
    );
  
    console.log(req.params.blogPostsId);
  
    // send a proper response
    res.status(200).send(filteredblogPosts);
  });

export default blogRouter;
