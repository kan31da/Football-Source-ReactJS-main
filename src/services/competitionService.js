import * as request from "../utils/request";

const baseUrl = "http://localhost:3456/competitions";

export const getAllCompetitions = async () => {

    try {
        const result = await request.get(baseUrl);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getCompetitionByAlias = async (alias) => {

    try {
        const result = await request.get(`${baseUrl}/${alias}`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getCompetitionStandingsByAlias = async (alias) => {

    try {
        const result = await request.get(`${baseUrl}/${alias}/standings`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getCompetitionMatchesByAlias = async (alias) => {

    try {
        const result = await request.get(`${baseUrl}/${alias}/matches`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getCompetitionMatchesByAliasFiltered = async (alias, dateFrom, dateTo) => {
    try {
        const result = await request.get(`${baseUrl}/${alias}/matches/filter/${dateFrom}/${dateTo}`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getCompetitionTeamsByAlias = async (alias) => {

    try {
        const result = await request.get(`${baseUrl}/${alias}/teams`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getCompetitionTopScorersByAlias = async (alias, limit) => {

    try {
        const result = await request.get(`${baseUrl}/${alias}/scorers/${limit}`);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};