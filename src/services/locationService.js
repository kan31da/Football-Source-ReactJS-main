import * as request from "../utils/request";

const baseUrl = "https://api.opencagedata.com/geocode/v1/json";
const apiKey = '00eb2aee58b742b78b6d94143d8b61d9';

export const getLocationByAddress = async (address) => {

    try {
        const result = await request.get(`${baseUrl}?q=${address}&key=${apiKey}`)
        
        console.log(result);

        return result;
    } 
    catch (error) {
        console.log(error);

        return null;
    }
};