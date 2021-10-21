import express from "express";
import uniqid from "uniqid";
import path, { dirname, join } from "path"; // CORE MODULE (doesn't need to be installed)

// Functions stored into a variable to read & write
import { readBlogs, writeBlogs } from "../../lib/tools.js";

const blogRouter = express.Router();

// import.meta.url give us info about the url of the current module
// fileURLToPath converts that url into a path
// const currentFilePath = fileURLToPath(import.meta.url);
// const currentDir = dirname(currentFilePath);
// const currentDir = dirname(fileURLToPath(import.meta.url))
// const blogPostsJSONPath = path.join(currentDir, "blog.json");

//GET
blogRouter.get("/", async (req, res, next) => {
  try {
    // Read the file content obtaining the blog post array
    const blogPosts = await readBlogs();

    // Send back the array with a proper response
    res.status(200).send(blogPosts);
  } catch (error) {
    next(error); // res.send(500).send({ message: error.message });
  }
});

// //Get specific blog post ID
// GET
blogRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    // Read the file content
    const blogPosts = await readBlogs(); // JSON.parse(fs.readFileSync(blogPostsJSONPath));

    //filter and check the blog posts for that specific id
    const filterblogPosts = blogPosts.find(
      (blogPosts) => blogPosts.id === req.params.blogPostId
    );

    // console.log(req.params.blogPostsId);

    if (filterblogPosts.lenghth > 0) {
      // Send back the array with a proper response
      res.status(200).send(filterblogPosts);
    }else{
      createHttpError(404, `This blog post id: ${req.params.blogPostId}, was not found!`)
    }
  } catch (error) {
    next(error) // res.send(500).send({ message: error.message });
  }
});

export default blogRouter;
