const { Schema, model } = require('mongoose');
const { questionSchema } = require('./Questions');
const dateFormat = require('../utils/dateFormat');
const { Course } = require('./Course');
const { QuizResponse } = require('./QuizResponse');
const { getGrade } = require('../utils/dateFormat');

const quizSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    questions: [questionSchema],
    dueDate: {
        type: Date,
        required: true,
        get: (timestamp) => dateFormat(timestamp),
    },
    quizResponse: [QuizResponse.schema]
});

const Quiz = model('quiz', quizSchema);


const quizResolvers = {
    getQuizzes: async () => {
        const quiz = await Quiz.find({});
        return quiz;
    },

    getSingleQuiz: async (quizId) => {
        const quiz = await Quiz.findById(quizId);
        return quiz;
    },

    createQuiz: async (title, dueDate, courseId) => {
        const quiz = await Quiz.create({ title, dueDate });
        await Course.findOneAndUpdate(
            { _id: courseId },
            { $push: { quiz: quiz._id } },
            { new: true }
        );
        return quiz;
    },

    updateQuiz: async (args) => {
        const quiz = await Quiz.findByIdAndUpdate(args._id, args);
        return quiz;
    },

    deleteQuiz: async (quizId, courseId) => {
        const quiz = await Quiz.findByIdAndDelete(quizId);
        await Course.findOneAndUpdate(
            { quiz: courseId },
            { $pull: { quiz: quizId } }
        );
        return quiz;
    },

    addQuizQuestion: async (quizId, title, options, answer) => {
        return await Quiz.findOneAndUpdate(
            { _id: quizId },
            {
                $addToSet: {
                    questions: {
                        title,
                        options,
                        answer,
                    },
                },
            },
            {
                new: true,
                runValidators: true
            }
        );
    },

    updateQuizQuestion: async (quizId, questionId, title, options, answer) => {
        return await Quiz.findOneAndUpdate(
            { _id: quizId },
            {
                $set: {
                    questions: {
                        _id: questionId,
                        title,
                        options,
                        answer,
                    },
                },
            },
            {
                new: true,
            }
        )
    },

    deleteQuizQuestion: async (quizId, questionId) => {
        return await Quiz.findOneAndUpdate(
            { _id: quizId },
            {
                $pull: {
                    questions: {
                        _id: questionId,
                    },
                },
            },
            {
                new: true,
            }
        );
    },

    addQuizResponse: async ({ quizId, responses, student, rawScore }) => {
        const grade = getGrade(rawScore);
        const response = new QuizResponse({ responses, student, rawScore, grade });

        const updateQuiz = await Quiz.findByIdAndUpdate(quizId, { $push: { assignmentResponse: response } }, { new: true });

        return updateQuiz;
    },

    // gradeQuizResponse(quizId: ID!, responseId: ID!, rawScore: Int!): Assignments
    // gradeQuizResponse: async ({ quizId, responseId, rawScore }) => {
    //     const quiz = await Quiz.findOne({ _id: quizId });
    //     const response = quiz.quizResponse.id(responseId);
    //     const updatedResponse = {
    //         _id: responseId,
    //         responses: response.responses,
    //         student: response.student,
    //         rawScore: rawScore,
    //         grade: getGrade(rawScore)
    //     };

    //     return await Quiz.findOneAndUpdate(
    //         { _id: quizId },
    //         { $set: { quizResponse: { ...updatedResponse } } },
    //         { new: true }
    //     );
    // },

    getSingleQuizResponse: async (_id, quizId) => {
        const quiz = await Quiz.findOne({ _id: quizId });
        return quiz.quizResponse.id(_id);
    },

    getAllQuizResponse: async (quizId) => {
        const quiz = await Quiz.findOne({ _id: quizId });
        return quiz.quizResponse;
    },

    getQuizQuestions: async (quizId) => {
        const quiz = await Quiz.findOne({ _id: quizId });
        return quiz.questions;
    }

};

module.exports = { Quiz, quizResolvers };
