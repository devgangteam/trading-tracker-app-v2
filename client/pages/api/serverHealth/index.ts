import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { makeRequestWithAccessToken } from '../../../utils/axiosRemote';

export default withApiAuthRequired(async function products(req, res) {
    await makeRequestWithAccessToken(req,res, 'health', 'get');
});