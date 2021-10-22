import express from "express";
import multer from "multer";
import uniqid from "uniqid";
import createError from "http-errors";
import { validationResult } from "express-validator";
import { readComments } from "../lib/tools.js";

const commentsRouter = express.Router();

//1. GET all comments
commentsRouter.get("/:blogPostId/comments", async (req, res, next) => {
  try {
    console.log("Getting all comments");
    const comments = await readComments();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});
// 2 GET specific comment
commentsRouter.get(
  "/:blogPostId/comments/:commentId",
  async (req, res, next) => {
    try {
      const comments = await readComments();
      const comment = comments.find(
        (comment) => comment._id === req.params.commentId
      );
      if (comment) {
        res.send(comment);
      } else {
        next(createError(404, "This comment is not found!"));
      }
    } catch (error) {
      next(error);
    }
  }
);

// 3  POST a comment
commentsRouter.post("/:blogPostId/comments", async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { text, image } = req.body;
      const comments = readComments();
      const newComment = {
        _id: uniqid(),
        author: this.params.id,
        image,
        text,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      comments.push(newComment);
    } else {
      next(createError(400, { errorList: errors }));
    }
  } catch (error) {
    next(error);
  }
});

// 4 PUT COMMENT
commentsRouter.put("/:blogPostId/comments/:commentId", async (req, res, next) => {
  try {
    const comments = await readComments();
    const remainingComments = comments.filter(
      (comment) => comment._id !== req.params.commentId
    );
    const updatedComment = { ...req.body, _id: req.params.commentId };
    await remainingComments.push(updatedComment);
    res.send(updatedComment);
  } catch (error) {
    next(error);
  }
});

//  5 DELETE comment
commentsRouter.delete("/:blogPostId/comments/:commentId", async (req, res, next) => {
  try {
    const comments = await readComments();
    const remainingComments = comments.filter(
      (comment) => comment._id !== req.params.commentId
    );
    const updatedComment = { ...req.body, _id: req.params.commentId };
    await writeComment(remainingComments);
    res.status(200).send("Comment has been deleted");
  } catch (error) {
    next(error);
  }
});
export default commentsRouter;
