
//These methods will collect from the test body all those components independently to perform API requests. (add parameters inside of the method).

export class RequestHandler {

    private baseUrl?: string
    private defaultBaseUrl: string = process.env.API_BASE_URL as string //temporary injection @ToDo
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: object = {}
    private apiBody: object = {}

    url(url: string){
        this.baseUrl = url
        return this
    }

    path(path: string){
        this.apiPath = path
        return this
    }

    params(params: object){
        this.queryParams = params
        return this
    }

    headers(headers: object){
        this.apiHeaders = headers
        return this
    }

    body(body: object){
        this.apiBody = body
        return this
    }

    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value)
        }
        return url.toString()
    }

}

