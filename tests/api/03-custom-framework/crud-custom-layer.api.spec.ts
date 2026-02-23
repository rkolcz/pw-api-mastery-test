import { test } from '../../../fixtures/ api.fixture';
import { RequestHandler } from '../../../utils/request-handler'

test('first', async({}) => {
    const api = new RequestHandler()
   
    api
        .url('/')
        .path('/articles')
        .params({limit:10, offset:0})
        .headers({Authorization: 'authHeader'})
        .body({ "user": { "email": "pwtestm007@wp.pl", "password": "pwtestm007" }})



})





