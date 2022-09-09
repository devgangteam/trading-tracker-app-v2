import axios from 'axios';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export const remoteAxios = axios.create({
    baseURL: 'http://localhost:7000',
});
export const makeRequestWithAccessToken = async (req: NextApiRequest, res: NextApiResponse, url: string, method: string) => {
    const { accessToken } = await getAccessToken(req, res);
    try {
        const response = await remoteAxios(url, {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        res.status(200).send(response.data);
    } catch (error: any) {
        res.status(error.status || 500).json({
            code: error.code,
            error: error.message
        });
    }
}
