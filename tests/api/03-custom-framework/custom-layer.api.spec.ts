import { test } from '../../../fixtures/ api.fixture';
import { RequestHandler } from '../../../utils/request-handler'

test('first', async({api}) => {
   
    api
        .url('https://tst.pl') //fallback to defaultBaseUrl if undefined
        .path('/articles')
        .params({limit:10, offset:0})
        .headers({Authorization: 'authHeader'})
        .body({ "user": { "email": process.env.E2E_EMAIL, "password": process.env.E2E_PASSWORD }})



})





