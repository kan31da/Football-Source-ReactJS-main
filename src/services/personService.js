import * as request from "../utils/request";

const baseUrl = "http://localhost:3456/people";

export const getPersonById = async (id) => {

    try {
        const result = await request.get(`${baseUrl}/${id}`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getPersonMatchesById = async (id) => {

    try {
        const result = await request.get(`${baseUrl}/${id}/matches`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};