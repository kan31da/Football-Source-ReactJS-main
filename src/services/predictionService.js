import * as request from "../utils/request";

const baseUrl = "http://localhost:3030/data/predictions";


export const getPredictionById = async (id) => {

    try {
        const query = new URLSearchParams({
            load: `owner=_ownerId:users`
        })

        const result = await request.get(`${baseUrl}/${id}?${query}`);
        
        if (result.code) {
            throw new Error(result.message)
        }

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getAllPredictions = async () => {

    try {
        const query = new URLSearchParams({
            load: `owner=_ownerId:users`
        })

        const result = await request.get(`${baseUrl}?${query}&sortBy=_createdOn desc`);
        
        if (result.code) {
            throw new Error(result.message)
        }

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const create = async (matchId, match, prediction, notes, entityDate, dateCreated, lastModifiedOn) => {

    try {
        const newPrediction = await request.post(baseUrl, {matchId, match, prediction, notes, entityDate, dateCreated, lastModifiedOn});
        
        return newPrediction;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const remove = async (_id) => {

    try {
        await request.remove(`${baseUrl}/${_id}`);
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const update = async (_id, matchId, match, prediction, notes, entityDate, dateCreated, lastModifiedOn) => {

    try {
		const updatedPrediction = await request.put(`${baseUrl}/${_id}`, {matchId, match, prediction, notes, entityDate, dateCreated, lastModifiedOn, _id});

		return updatedPrediction;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};