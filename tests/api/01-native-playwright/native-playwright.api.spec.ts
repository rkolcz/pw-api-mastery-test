import {test, expect, request} from '@playwright/test'

test('POST /articles - should create a new article', async ({request}) => {
    //POST(login) - extract web token
    const articlesResponse = await request.post('/users/login/', {
        data: { user: { email: process.env.E2E_EMAIL, password: process.env.E2E_PASSWORD } },
    })
    const responseBody = await articlesResponse.json()
    const token = `Token ${responseBody.user.token}`

    //POST(articles) - create new article
    const createNewArticle = await request.post('/articles/', {
        data: {
            "article":{
            "title": "POST new article - API Test",
            "description":"about test",
            "body":"lets start",
            "tagList": ["test", "test", "test"]
            },
        },
        headers: {Authorization: token}
    })
    const createNewArticleBody = await createNewArticle.json()
    expect(createNewArticle.status()).toEqual(201)
    expect(createNewArticle.headers()['content-type']).toContain('application/json')
    const articleId = createNewArticleBody.article.slug

    //GET(articles) - read all articles
    const readAllArticles = await request.get('/articles/', {
        headers: {Authorization: token}
    })
    const readAllArticlesBody = await readAllArticles.json()
    expect(readAllArticlesBody.articles[0].title).toEqual('POST new article - API Test')

    
})