/**
 * 
 * Classe dédiée aux appels aux APIs
 * 
 * @author Mathis NGUYEN
 * @version 3.0
 * @description Réalise des appels aux APIs
 *  
 */


import { APIRequestObject } from '@commun/types';

export class ApiClient {

    private apiRequest : APIRequestObject

    constructor(apiRequest: APIRequestObject) {
        this.apiRequest = apiRequest;
    }

    private async request(endpoint: string, method: string, headerOptions: Record<string, string>, urlParams: Record<string, string>, body: any): Promise<Response> {
        try {

            let headers: Record<string, string> = {};

            //Add authorization in header
            if (this.apiRequest.authMethod === 'Basic Auth') {
                if (this.apiRequest.username != undefined && this.apiRequest.password != undefined) {
                    headers['Authorization'] = `Basic ${btoa(`${this.apiRequest.username}:${this.apiRequest.password}`)}`;
                } else {
                    throw new Error('Username and password are required for Basic Auth.');
                } 
            } else if (this.apiRequest.authMethod === 'Bearer Token') {
                if (this.apiRequest.token != undefined) {
                    headers['Authorization'] = `Bearer ${this.apiRequest.token}`;
                } else {
                    throw new Error('Token is required for Bearer Token authentication.');
                }
            }

            //Add other options in header (redefining authorization is also possible)
            if (headerOptions) {
                Object.assign(headers, headerOptions);
            }

            //Construct url with parameters
            let url = `${this.apiRequest.baseUrl}${endpoint}`;
            if (urlParams) {
                const queryString = Object.entries(urlParams)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join('&');
                url += `?${queryString}`;
            }

            //Fetch and call API
            const response = await fetch(url, {
                method,
                headers,
                body
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            return response;

        } catch (error) {
            console.error("Error occurred during API call : ", error);
            throw error;
        }
    }

    public async get(endpoint: string, headerOptions: Record<string, string>, urlParams: Record<string, string>): Promise<Response> { //Note : use null value if param is not needed
        return this.request(endpoint, 'GET', headerOptions, urlParams, null);
    }

    public async post(endpoint: string, headerOptions: Record<string, string>, body: any, urlParams: Record<string, string>): Promise<Response> { //Note : use null value if param is not needed
        return this.request(endpoint, 'POST', headerOptions, urlParams, body);
    }
}



// *********************************************************** USAGE ***********************************************************

/*const apiRequestSigale: APIRequestObject = {
    baseUrl: 'http://sigale.prosol:9999/',
    authMethod: 'Bearer Token',
    token: 'your_token'
};

const apiClientSigale = new ApiClient(apiRequestSigale);

const params = {
    'param_name' : 'value',
};

const headerOptions = {
    'Content-Type' : 'application/json'
}

var response = await apiClientSigale.get("your-endpoint", headerOptions, params)
var jsonResponse = await response.json()
*/


