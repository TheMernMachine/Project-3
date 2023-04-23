const { AuthenticationError } = require("apollo-server-express");
const { User, userResolvers,
    Assignments, assignmentResolvers,
    Course, courseResolvers,
    todoListSchema, todoResolvers,
    Alerts, alertResolvers,
    Role, roleResolvers,
    LessonNotes, lessonNotesResolvers,
    Forum, forumResolvers,
    Quiz, quizResolvers,
} = require("../models");
const { signToken } = require("../utils/auth");


const resolvers = {

    Query: {
        users: async () => {
            return userResolvers.getAllUsers();
        },
        user: async (parent, { email }) => {
            return userResolvers.getSingleUser(email);
        },
        getUser: async (parent, { _id }) => {
            return userResolvers.getUser(_id);
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return userResolvers.getUser(context.user._id);
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        assignments: async () => {
            return assignmentResolvers.getAssignments();
        },
        assignment: async (parent, { _id }) => {
            return assignmentResolvers.getSingleAssignment({ _id });
        },
        alert: async () => {
            return alertResolvers.getAlerts();
        },

        // Get all the todo lists for a specific user
        getTodoLists: async (parent, { _id }) => {
            return todoResolvers.getTodoLists(_id);
        },
        getTodoList: async (parent, { _id, todoId }) => {
            return todoResolvers.getTodoList(_id, todoId);
        },

        courses: async () => {
            return courseResolvers.getCourses();
        },
        course: async (parent, { _id }) => {
            return courseResolvers.getSingleCourse(_id);
        },

        roles: async () => {
            return roleResolvers.getRoles();
        },
        role: async (parent, { _id }) => {
            return roleResolvers.getSingleRole(_id);
        },
        findRoleByName: async (parent, { name }) => {
            return roleResolvers.findRoleByName(name);
        },

        lessonNotes: async () => {
            return lessonNotesResolvers.getLessonNotes();
        },
        lessonNote: async (parent, { _id }) => {
            return lessonNotesResolvers.getSingleLessonNote({ _id });
        },

        getLessonComments: async (parent, { _id }) => {
            return lessonNotesResolvers.getLessonComments(_id);
        },
        getSingleLessonComment: async (parent, { _id, commentId }) => {
            return lessonNotesResolvers.getSingleLessonComment(_id, commentId);
        },

        getForum: async () => {
            return forumResolvers.getAllForums();
        },
        getSingleForum: async (parent, { _id }) => {
            return forumResolvers.getSingeForum(_id);
        },
        getForumComments: async (parent, { _id }) => {
            return forumResolvers.getForumComments(_id);
        },
        getSingleForumComment: async (parent, { _id, commentId }) => {
            return forumResolvers.getSingleForumComment(_id, commentId);
        },

        getQuiz: async () => {
            return quizResolvers.getQuizzes();
        },
        getSingleQuiz: async (parent, { _id }) => {
            return quizResolvers.getSingleQuiz(_id);
        }
        

    },

    //queries fetch data
    //mutations change data

    Mutation: {

        addAlert: async (parent, args, { message, severity }) => {
            return alertResolvers.addAlert(message, severity);
        },
        removeAlert: async (parent, args, { _id }) => {
            return alertResolvers.removeAlert(_id);
        },
        updateAlert: async (parent, { _id, message, severity }) => {
            return alertResolvers.updateAlert({ _id, message, severity });
        },



        addUser: async (parent, { firstName, lastName, email, password, role }) => {
            return userResolvers.createUser({ firstName, lastName, email, password, role });
        },
        login: async (parent, { email, password }) => {
            return userResolvers.login({ email, password });
        },
        // Update to use context.user for front-end
        updateUser: async (parent, { _id, firstName, lastName, email, password }) => {
            return userResolvers.updateUser({ _id, firstName, lastName, email, password, profilePic });
            // if (context.user) {
            //     return userResolvers.updateUser(context.user._id, args);
            // }
            // throw new AuthenticationError('Not logged in');
        },
        setUserStatus: async (parent, { _id, userId, status }) => {
            return userResolvers.setUserStatus(_id, userId, status);
        },

        addAssignment: async (parent, { title, question, due_date, alert, assignmentResponse }) => {
            return assignmentResolvers.createAssignment( title, question, due_date, alert, assignmentResponse );
        },
        updateAssignment: async (parent, { _id, title, question, due_date, alert, assignmentResponse }) => {
            return assignmentResolvers.updateAssignment({ _id, title, question, due_date, alert, assignmentResponse });
        },
        deleteAssignment: async (parent, { _id }) => {
            return assignmentResolvers.deleteAssignment({ _id });
        },

        addTodoList: async (parent, { _id, title, todo, priority }) => {
            console.log("resolve", _id, title, todo, priority);
            return todoResolvers.addTodoList(_id, title, todo, priority);
        },
        // updateTodoList: async (parent, args) => {
        //     return todoResolvers.updateTodoList(args);
        // }, 
        deleteTodoList: async (parent, { _id, todoId }) => {
            return todoResolvers.deleteTodoList(_id, todoId);
        },

        addCourse: async (parent, { title, description, startDate, endDate }) => {
            return courseResolvers.createCourse(title, description, startDate, endDate);
        },
        updateCourse: async (parent, { _id, title, description, startDate, endDate }) => {
            return courseResolvers.updateCourse({ _id, title, description, startDate, endDate });
        },
        deleteCourse: async (parent, { _id }) => {
            return courseResolvers.deleteCourse({ _id });
        },

        addRole: async (parent, { name, permissions }) => {
            return roleResolvers.createRole(name, permissions);
        },
        updateRole: async (parent, { _id, name, permissions }) => {
            return roleResolvers.updateRole({ _id, name, permissions });
        },
        deleteRole: async (parent, { _id }) => {
            return roleResolvers.deleteRole({ _id });
        },

        addLessonNotes: async (parent, { title, content }) => {
            return lessonNotesResolvers.createLessonNotes(title, content);
        },
        updateLessonNotes: async (parent, { _id, title, content }) => {
            return lessonNotesResolvers.updateLessonNotes(_id, title, content);
        },
        deleteLessonNotes: async (parent, { _id }) => {
            return lessonNotesResolvers.deleteLessonNotes(_id);
        },

        addLessonComment: async (parent, { _id, commentText, commentAuthor }) => {
            return lessonNotesResolvers.addLessonComment(_id, commentText, commentAuthor);
        },
        updateLessonComment: async (parent, { _id, commentId, commentText, commentAuthor }) => {
            return lessonNotesResolvers.updateLessonComment(_id, commentId, commentText, commentAuthor);
        },
        deleteLessonComment: async (parent, { _id, commentId }) => {
            return lessonNotesResolvers.deleteLessonComment(_id, commentId);
        },

        addForum: async (parent, { title, postQuestion, postAuthor }) => {
            return forumResolvers.createForum(title, postQuestion, postAuthor);
        },
        updateForum: async (parent, { _id, title, postQuestion, postAuthor }) => {
            return forumResolvers.updateForum(_id, title, postQuestion, postAuthor);
        },
        deleteForum: async (parent, { _id }) => {
            return forumResolvers.deleteForum(_id);
        },

        addForumComment: async (parent, { _id, commentText, commentAuthor }) => {
            return forumResolvers.addForumComment(_id, commentText, commentAuthor);
        },
        updateForumComment: async (parent, { _id, commentId, commentText, commentAuthor }) => {
            return forumResolvers.updateForumComment(_id, commentId, commentText, commentAuthor);
        },
        deleteForumComment: async (parent, { _id, commentId }) => {
            return forumResolvers.deleteForumComment(_id, commentId);
        },

        addQuiz: async (parent, { title, questions }) => {
            return quizResolvers.createQuiz(title, questions);
        },
        updateQuiz: async (parent, { _id, title, questions }) => {
            return quizResolvers.updateQuiz({_id, title, questions});
        },
        deleteQuiz: async (parent, { _id }) => {
            return quizResolvers.deleteQuiz(_id);
        },

        addQuizQuestion: async (parent, { _id, title, options, answer }) => {
            return quizResolvers.addQuizQuestion(_id, title, options, answer);
        },
        updateQuizQuestion: async (parent, { _id, questionId, title, options, answer }) => {
            return quizResolvers.updateQuizQuestion(_id, questionId, title, options, answer);
        },
        deleteQuizQuestion: async (parent, { _id, questionId }) => {
            return quizResolvers.deleteQuizQuestion(_id, questionId);
        },
        
    },
};

module.exports = resolvers;
