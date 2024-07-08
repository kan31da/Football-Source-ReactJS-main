import * as request from "../utils/request";

const baseUrl = "http://localhost:3456/matches";

export const getMatchesByDate = async (dateFrom, dateTo) => {

    try {
        const result = await request.get(`${baseUrl}/${dateFrom}/${dateTo}`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getMatchById = async (id) => {

    try {
        const result = await request.get(`${baseUrl}/${id}`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getMatchHeadToHeadById = async (id) => {
    try {
        const result = await request.get(`${baseUrl}/${id}/headtohead`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};