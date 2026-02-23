import { test } from '../../../fixtures/api.fixture';
import { RequestHandler } from '../../../utils/request-handler'
import { expect } from '@playwright/test'

test('GET /articles - should read all articles', async({api}) => {
   
    const response = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(response.articles.length).toBeLessThanOrEqual(10)
    expect(response.articlesCount).toEqual(10)
})





