import { APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';
import FormData from 'form-data';
import * as fs from 'fs';
import path from 'path'


const admin_email: string = process.env.ADMIN_EMAIL || '';
const admin_password: string = process.env.ADMIN_PASSWORD || '';
const user_email: string = process.env.VALID_EMAIL || '';
const user_password: string = process.env.VALID_PASSWORD || '';

let adminAccessToken: any = null;
let userAccessToken: any = null;
let user: any = null;
let unit: any = null;

class ApiHelper {
    private defaultHeaders: { [key: string]: string };
    constructor(private request: APIRequestContext) {
        this.request = request;
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        }
    }

    async createAdminAccessToken() {
        if(adminAccessToken === null) {
            await this.request
                .post(`${process.env.HOMEPAGE_URL}api/auth/jwt/create/`, {
                    data: {
                        email: admin_email,
                        password: admin_password
                    }
                }).then(async (response) => {
                    adminAccessToken = (await response.json()).access
                })
        }
        return adminAccessToken
    }

    async createUserAccessToken() {
        if(userAccessToken === null) {
            await this.request
                .post(`${process.env.HOMEPAGE_URL}api/auth/jwt/create/`, {
                    data: {
                        email: user_email,
                        password: user_password
                    }
                }).then(async (response) => {
                    userAccessToken = (await response.json()).access
                })
        }
        return userAccessToken
    }

    async getUserDetails() {
        const accessAdminToken = await this.createAdminAccessToken();
        await this.request
              .get(`${process.env.HOMEPAGE_URL}api/backcall/`, {
                headers: {
                    Authorization: `Bearer ${accessAdminToken}`
                }
              })
              .then(async (response) => {
                user = await response.json();
              }) 

        return user
    }

    async createUnit(accessUserToken: string, unitName: string) {
        const modelName = faker.lorem.word();
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const description = faker.lorem.sentence();
        const feature = faker.lorem.sentence();
        const phoneNumber = `+38099${faker.string.numeric(7)}`;
        const price = faker.number.int({min: 1000, max: 10000});

        const response = await this.request
              .post('https://dev.rentzila.com.ua/api/units/', {
                headers: {
                    Authorization: `Bearer ${accessUserToken}`,
                    ...this.defaultHeaders
                },
                data: JSON.stringify({
                    "name": `${unitName}`,
                    "first_name": `${firstName}`,
                    "last_name": `${lastName}`,
                
                    "declined_incomplete": false,
                    "declined_censored": false,
                    "declined_incorrect_price": false,
                    "declined_incorrect_data": false,
                    "declined_invalid_img": false,
                    "slug": "",

                    "model_name": `${modelName}`,
                    "description": `${feature}`,
                    "features": `${description}`,
                    "rating": 0,
                    "views_count": 0,
                    "type_of_work": "HOUR",
                    "time_of_work": "FOUR",
                    "phone": `${phoneNumber}`,
                    "minimal_price": price,
                    "money_value": "UAH",
                    
                    "payment_method": "CASH_OR_CARD",
                   
                    "lat": 50.438306372578765,
                    "lng": 30.608596801757816,
                   
                    "count": 1,
                   
                    "is_approved": null,
                    "is_archived": false,
                    "manufacturer": 1107,
                    "owner": 1776,
                    "category": 360,
                    "services": [
                        118
                    ]

                  })
              })

            unit = await response.json();

            return { response, unit }
    }

    async getUnitsList(accessUserToken: string) {
        const response = await this.request
            .get('https://dev.rentzila.com.ua/api/units/', {
            headers: {
                Authorization: `Bearer ${accessUserToken}`,
                ...this.defaultHeaders
                }
            })
        const responseData = await response.json();

        return responseData;
    }

    async deleteUnit(accessUserToken: string, unitId: any) {
        const response = await this.request.delete(`https://dev.rentzila.com.ua/api/units/${unitId}/`, {
            headers: {
                Authorization: `Bearer ${accessUserToken}`,
                ...this.defaultHeaders
            }
        });
    
        return response;
    }

    async uploadUnitPhoto(accessUserToken: string, unitId: number) {
        const response = await this.request.post('https://dev.rentzila.com.ua/api/unit-images/', {
            headers: {
                'Authorization': `Bearer ${accessUserToken}`,
            },
            multipart: {
                unit: unitId.toString(),
                image: {
                    name: 'pexels-albinberlin-919073.jpg',
                    mimeType: 'image/jpg',
                    buffer: fs.readFileSync('./data/photo/pexels-albinberlin-919073.jpg')
                },
                is_main: 'true'
            }
        });

        const responseData = await response.json();
    
        return {response, responseData};
    }

    async getUnitId(accessToken: string, unitName: string) {
        const unitsList = await this.getUnitsList(accessToken);
        let createdUnitId: any;

        unitsList.results.forEach((unit: any) => {

            if(unit.name === unitName) {
                createdUnitId = unit.id
            }
        })
        return createdUnitId;
    }

    async deleteAllUnits(accessToken: string) {
        const unitsList = await this.getUnitsList(accessToken);
        for(const unit of unitsList.results) {
            if(unit.owner === 1776) {
                await this.deleteUnit(accessToken, unit.id)
            }
        }
    }
}

export default ApiHelper;