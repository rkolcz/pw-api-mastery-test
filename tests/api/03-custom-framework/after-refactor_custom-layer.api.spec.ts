import { test } from '../../../fixtures/api.fixture';
import { RequestHandler } from '../../../utils/request-handler'
import { expect } from '@playwright/test'

let authToken: string

test.beforeAll('Login - extract web token', async ({api}) => {
    const tokenRespons = await api
        .path('/users/login')
        .body({ "user": { "email": process.env.E2E_EMAIL, "password": process.env.E2E_PASSWORD }})
        .postRequest(200)
    authToken = "Token " + tokenRespons.user.token;
})

test('[GET] should read all articles', async({api}) => {
    const response = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(response.articles.length).toBeLessThanOrEqual(10)
    expect(response.articlesCount).toEqual(10)
})

test('[POST][GET][DELETE] should create, list and delete an article', async ({api}) => {
    const createNewArticleResponse = await api
        .path('/articles')
        .headers({Authorization: authToken})
        .body({"article":{"title": "POST new article - API Test", "description":"about test", "body":"lets start", "tagList": ["test"]},})
        .postRequest(201)
    // console.log(createNewArticleResponse)
    expect(createNewArticleResponse.article.title).toEqual('POST new article - API Test')  
    const articleId = createNewArticleResponse.article.slug

    const articlesResponse = await api
        .path('/articles')
        .headers({Authorization: authToken})
        .params({limit:10, offset:0})
        .getRequest(200)
    // console.log(articlesResponse)
    expect(articlesResponse.articles[0].title).toEqual('POST new article - API Test')

    await api
        .path(`/articles/${articleId}`)
        .headers({Authorization: authToken})
        .deleteRequest(204)

    const articlesAfterDelete = await api
        .path('/articles')
        .headers({Authorization: authToken})
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(articlesAfterDelete.articles[0].title).not.toEqual('POST new article - API Test')

})





