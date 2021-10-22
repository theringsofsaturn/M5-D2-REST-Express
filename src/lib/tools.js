import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// methods from fs-extra library
const { readJSON, writeJSON, writeFile } = fs;

// Folders URL path
const dataFolder = join(dirname(fileURLToPath(import.meta.url)), "../data");
const authorsJSONPath = join(dataFolder, "authors.json");
const blogPostsJSONPath = join(dataFolder, "blog.json");
const authorsPublicFolderPath = join(dataFolder, "../../public/img/users");
const commentsJSONpath = join(dataFolder, "../data/comments.json");

// Functions stored into a variable to read & write
export const readAuthors = async () => await readJSON(authorsJSONPath);
export const writeAuthors = async (content) =>
  await writeJSON(authorsJSONPath, content);
export const readBlogs = async () => await readJSON(blogPostsJSONPath);
export const writeBlogs = async (content) =>
  await writeJSON(blogPostsJSONPath, content);
export const readComments = async () => await readJSON(commentsJSONpath);
export const writeAuthorImage = async (filename, content) =>
  await writeFile(join(authorsPublicFolderPath, filename), content);
