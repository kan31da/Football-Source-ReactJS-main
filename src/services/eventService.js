import * as request from "../utils/request";

const baseUrl = "http://localhost:3030/data/events";

export const getAllUpcomingEvent = async (offset, pageSize) => {

    try {
        const query = new URLSearchParams({
            offset: offset,
            pageSize: pageSize
        })

        const result = await request.get(`${baseUrl}?${query}&sortBy=_createdOn desc`);
        
        if (result.code){
            throw new Error(result.message)
        }

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getAllUpcomingEventCount = async () => {
	try {
		const result = await request.get(`${baseUrl}?count`);
	
		return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const create = async (name, imageUrl, description, startDate) => {

    try {
        const newEvent = await request.post(baseUrl, {name, imageUrl, description, startDate});
        
        return newEvent;
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

export const update = async (_id, name, imageUrl, description, startDate) => {

    try {
		const updatedEvent = await request.put(`${baseUrl}/${_id}`, {name, imageUrl, description, startDate, _id});

		return updatedEvent;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const getLatestUpcomingEvent = async () => {

    try {
        const query = new URLSearchParams({
            offset: 0,
            pageSize: 1
        })

        const result = await request.get(`${baseUrl}?sortBy=startDate&${query}`);

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