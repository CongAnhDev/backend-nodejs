const Project = require('../models/project');
const aqp = require('api-query-params');
module.exports = {
    createProject: async (data) => {
        if (data.type === "EMPTY-PROJECT") {
            let result = await Project.create(data);
            return result;
        }
        if (data.type === "ADD-USERS") {
            let myProject = await Project.findById(data.projectId).exec();

            for (let i = 0; i < data.usersArr.length; i++) {
                myProject.usersInfor.push(data.usersArr[i]);
            }
            // check user co ton tai trong du an hay chua sau do moi push

            let newResult = await myProject.save();

            //find project by id
            return newResult;
        }
        if (data.type === "REMOVE-USERS") {
            let myProject = await Project.findById(data.projectId).exec();

            for (let i = 0; i < data.usersArr.length; i++) {
                myProject.usersInfor.pull(data.usersArr[i]);
            }
            // check user co ton tai trong du an hay chua sau do moi push

            let newResult = await myProject.save();

            //find project by id
            return newResult;
        }
        if (data.type === "ADD-TASKS") {
            let myProject = await Project.findById(data.projectId).exec();
            // Check if the project was successfully retrieved
            if (!myProject) {
                // Handle the case where no project was found
                console.log(`No project found with ID: ${data.projectId}`);
                return null; // Or throw an error, or however you wish to handle this case
            }

            for (let i = 0; i < data.taskArr.length; i++) {
                myProject.tasks.push(data.taskArr[i]);
            }

            let newResult = await myProject.save();
            return newResult;
        }
        return null;
    },
    getProject: async (queryString) => {
        const page = queryString.page;

        const { filter, limit, population } = aqp(queryString);

        delete filter.page;

        let offset = (page - 1) * limit;
        result = await Project.find(filter)
            .populate(population)
            .skip(offset)
            .limit(limit)
            .exec();
        return result
    },

    uProject: async (data) => {
        try {
            let result = await Project.updateOne({ _id: data.id }, { ...data });
            return result;
        } catch (error) {
            console.log(">>>error: ", error);
            return null;
        }
    },

    dProject: async (id) => {

        try {
            let result = await Project.deleteById(id);
            return result;
        } catch (error) {
            console.log(">>>error: ", error);
            return null;
        }
    }
}