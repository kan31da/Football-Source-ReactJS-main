import * as request from "../utils/request";

const baseUrl = "http://localhost:3456/teams";

export const getAllTeams = async () => {

    try {
        const limit = 500;

        const result = await request.get(`${baseUrl}/all/${limit}`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getTeamById = async (id) => {

    try {
        const result = await request.get(`${baseUrl}/${id}`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getTeamMatchesById = async (id) => {

    try {
        const result = await request.get(`${baseUrl}/${id}/matches`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};