import fs from "fs-extra"
import {fileURLToPath} from "url"
import {dirname, extname, join} from "path"

import multer from "multer";

// Folders URL path
const dataFolder = join(dirname(fileURLToPath(import.meta.url)), "../data")
const authorsJSONPath = join(dataFolder , "authors.json")
const blogPostsJSONPath = join(dataFolder , "blog.json")
const publicFolderAuthors = join(process.cwd() , "./public/img/authors/")
const publicFolderBlog = join(process.cwd() , "./public/img/cover/")

export const parseFile = multer();

export const uploadFile = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extension = extname(originalname);
    const fileName = `${req.params.id}${extension}`;
    const pathToFile = path.join(publicDirectory, fileName);
    fs.writeFileSync(pathToFile, buffer);
    const link = `http://localhost:3001/${fileName}`;
    req.file = link;
    next();
  } catch (error) {
    next(error);
  }
};
