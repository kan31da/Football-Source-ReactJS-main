import * as request from "../utils/request";

const baseUrl = "http://localhost:3030/data/comments";

export const getAllForEntity = async (entityId, offset, pageSize) => {
	try {
        const query = new URLSearchParams({
            where: `entityId="${entityId}"`,
            offset: offset,
            pageSize: pageSize
        })

		const result = await request.get(`${baseUrl}?${query}&sortBy=_createdOn desc`);

		return result;
    } 
    catch (error) {
        console.log(error);

        return [];
    }
};

export const getTotalCountForEntity = async (entityId) => {
	try {
        const query = new URLSearchParams({
            where: `entityId="${entityId}"`,
        })

		const result = await request.get(`${baseUrl}?${query}&count`);

		return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const create = async (type, entityId, username, text, dateCreated, lastModifiedOn) => {
	try {
		const newComment = await request.post(baseUrl, {type, entityId, username, text, dateCreated, lastModifiedOn});

		return newComment;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const update = async (_id, type, entityId, userId, username, text, dateCreated, lastModifiedOn) => {
	try {
		const updateDocument = await request.put(`${baseUrl}/${_id}`, {type, entityId, userId, username, text, dateCreated, lastModifiedOn, _id});

		return updateDocument;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const remove = async (commentId) => {
	try {
		await request.remove(`${baseUrl}/${commentId}`);
    } 
    catch (error) {
        console.log(error);
    }
};