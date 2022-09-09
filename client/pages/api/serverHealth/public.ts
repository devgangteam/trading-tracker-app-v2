import { NextApiRequest, NextApiResponse } from "next";
import { remoteAxios } from '../../../utils/axiosRemote';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const response = await remoteAxios.get('health/public');
    res.status(200).send(response.data);
  }