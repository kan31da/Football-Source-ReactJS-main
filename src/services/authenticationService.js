import * as request from "../utils/request";

const baseUrl = "http://localhost:3030/users";

export const login = async (email, password) => {
    try {
        const result = await request.post(`${baseUrl}/login`, {email, password});

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const register = async (values) => {
    try {
        const result = await request.post(`${baseUrl}/register`, {...values});
        
        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};

export const logout = async () => {
    try {
        await request.get(`${baseUrl}/logout`);
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};