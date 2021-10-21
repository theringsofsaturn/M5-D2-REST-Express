import fs from "fs-extra"
import {fileURLToPath} from "url"
import {dirname, join} from "path"
// methods from fs-extra library
const { readJSON, writeJSON, writeFile } = fs

// Folders URL path
const dataFolder = join(dirname(fileURLToPath(import.meta.url)), "../data")
const authorsJSONPath = join(dataFolder , "authors.json")
const blogPostsJSONPath = join(dataFolder , "blog.json")
const publicFolder = join(process.cwd() , ".public/img/authors")

// Functions stored into a variable to read & write 
export const readAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = (content) => writeJSON(authorsJSONPath , content)
export const readBlogs = () => readJSON(blogPostsJSONPath)
export const writeBlogs = (content) => writeJSON(blogPostsJSONPath , content)

export const authorsAvatarPic = () => (fileName , buffer) => writeFile(join(publicFolder , fileName) , buffer)
