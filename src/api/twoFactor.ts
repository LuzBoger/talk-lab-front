import type { TwoFactor } from "../types/TwoFactor";
import { apiTwoFactor } from "../utils/apiTwoFactor";


export const config2FA = async(): Promise<TwoFactor> => {
    const response  = await  apiTwoFactor.get("/config")
    return response.data;
} 

export const enable2FA = async(secret: string, code: string): Promise<any> => {
    const response = await apiTwoFactor.post("/enable", {secret, code});
    return response.data;
}

export const disable2FA = async():Promise<any> => {
    const response = await apiTwoFactor.post("/disable");
    return response.data;
}

export const check2FA = async(code: string) : Promise<any> => {
    const response = await apiTwoFactor.post("/check", {code});
    return response.data;
}

