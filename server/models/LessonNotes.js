const { Schema, model } = require('mongoose');
const { commentSchema } = require('./Comments');
const dateFormat = require('../utils/dateFormat');

const lessonNotes = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  comments: [commentSchema]
});

const lessonNotesResolvers = {
  getLessonNotes: async () => {
    const lessons = await LessonNotes.find({});
    return lessons;
  },
  getSingleLessonNote: async (lessonId) => {
    return await LessonNotes.findOne({ _id: lessonId });
  },
  createLessonNotes: async (title, content) => {
    return LessonNotes.create({ title, content });
  },
  deleteLessonNotes: async (lessonId) => {
    const lesson = await LessonNotes.findOneAndDelete({
      _id: lessonId,
    });
    return lesson;
  },
  updateLessonNotes: async (lessonId, title, content) => {
    const lesson = await LessonNotes.findOneAndUpdate(
      { _id: lessonId },
      { $set: { ...title, content, updatedAt: Date.now() } },
      { new: true }
    );
    return lesson;
  },
  getLessonComments: async (lessonId) => {
    const lesson = await LessonNotes.findOne({ _id: lessonId });
    return lesson.comments;
  },
  getSingleLessonComment: async (lessonId, commentId) => {
    // return await LessonNotes.findOne({ comments: { $elemMatch: { _id: { $eq: commentId } } } }, { "comments.$": 1 });
    // return await LessonNotes.findOne({ "comments._id": { $eq: commentId } }, { comments: 1 });
    const lesson = await LessonNotes.findOne({ _id: lessonId });
    console.log(lesson);
    const comments = lesson.comments.filter((comment) => comment._id.equals(commentId));
    return comments[0];
  },
  addLessonComment: async (lessonId, commentText, commentAuthor) => {
    return await LessonNotes.findOneAndUpdate(
      { _id: lessonId },
      {
        $addToSet: {
          comments: { commentText, commentAuthor },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  },
  updateLessonComment: async (lessonId, commentId, commentText, commentAuthor) => {
    return await LessonNotes.findOneAndUpdate(
      { _id: lessonId },
      {
        $set: {
          comments: {
            _id: commentId,
            commentText: commentText,
            commentAuthor: commentAuthor,
          },
        },
      },
      {
        new: true
      }
    );
  },
  deleteLessonComment: async (lessonId, commentId) => {
    return await LessonNotes.findOneAndUpdate(
      { _id: lessonId },
      {
        $pull: {
          comments: {
            _id: commentId,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
};

const LessonNotes = model('lessonNotes', lessonNotes);
module.exports = { LessonNotes, lessonNotesResolvers };