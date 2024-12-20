import { APIRequestContext, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import path from 'path';

const admin_email: string = process.env.ADMIN_EMAIL || '';
const admin_password: string = process.env.ADMIN_PASSWORD || '';
const user_email: string = process.env.VALID_EMAIL || '';
const user_password: string = process.env.VALID_PASSWORD || '';
const user_id: string = process.env.USER_ID || '';

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
        if (!adminAccessToken) {
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
        if (!userAccessToken) {
            await this.request
                .post(`${process.env.HOMEPAGE_URL}api/auth/jwt/create/`, {
                    headers: {
                        ...this.defaultHeaders
                    },
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

    async createUnit(accessUserToken: string, unitName: string, category: number = 360, returnIdOnly: boolean = false) {
        const modelName = faker.lorem.word();
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const description = faker.lorem.sentence();
        const feature = faker.lorem.sentence();
        const phoneNumber = `+38099${faker.string.numeric(7)}`;
        const price = faker.number.int({ min: 1000, max: 10000 });

        const response = await this.request
            .post(`${process.env.HOMEPAGE_URL}api/units/`, {
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
                    "owner": user_id,
                    "category": category,
                    "services": [
                        118
                    ]

                })
            })

        unit = await response.json();

        return returnIdOnly ? unit.id : { response, unit };
    }

    async getUnitsList(accessUserToken: string) {
        const response = await this.request
            .get(`${process.env.HOMEPAGE_URL}api/units/`, {
                headers: {
                    Authorization: `Bearer ${accessUserToken}`,
                    ...this.defaultHeaders
                }
            })
        const responseData = await response.json();

        return responseData;
    }
    async setUnitsActiveStatus(token: string, unitIds: number[]) {
        for (const unitId of unitIds) {
            const response = await this.request.patch(`${process.env.HOMEPAGE_URL}api/crm/units/${unitId}/moderate/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    is_approved: true
                }
            });

            expect(response.status()).toBe(200);

            const updatedResponse = await response.json();
            expect(updatedResponse.is_approved).toBe(true);
        }
    }

    async deleteUnit(accessUserToken: string, unitId: any) {
        const response = await this.request.delete(`${process.env.HOMEPAGE_URLl}api/units/${unitId}/`, {
            headers: {
                Authorization: `Bearer ${accessUserToken}`,
                ...this.defaultHeaders
            }
        });

        return response;
    }

    async uploadUnitPhoto(accessUserToken: string, unitId: number) {

        const imagePath = path.resolve('data/photo/', 'pexels-albinberlin-919073.jpg');
        const imageReadStream = fs.createReadStream(imagePath);

        const response = await this.request.post(`${process.env.HOMEPAGE_URL}api/unit-images/`, {
            headers: {
                Authorization: `Bearer ${accessUserToken}`
            },
            multipart: {
                unit: unitId.toString(),
                image: imageReadStream,
                is_main: 'true'
            }
        });

        return response;
    }

    async getUnitId(accessToken: string, unitName: string) {
        const unitsList = await this.getUnitsList(accessToken);
        let createdUnitId: any;

        unitsList.results.forEach((unit: any) => {

            if (unit.name === unitName) {
                createdUnitId = unit.id
            }
        })
        return createdUnitId;
    }

    async deleteAllUnits(accessToken: string) {
        const unitsList = await this.getUnitsList(accessToken);
        for (const unit of unitsList.results) {
            if (unit.owner === user_id) {
                await this.deleteUnit(accessToken, unit.id)
            }
        }
    }

    async moderateUnit(accessAdminToken: string, unitId: number) {
        const response = await this.request.patch(`${process.env.HOMEPAGE_URL}api/crm/units/${unitId}/moderate/`, {
            headers: {
                Authorization: `Bearer ${accessAdminToken}`,
                ...this.defaultHeaders
            },
            data: {
                "is_approved": true,
            }
        })

        return response
    }

    async searchUnitByName(accessToken: string, unitName: string) {
        const response = await this.request.get(`${process.env.HOMEPAGE_URL}api/crm/units/?search=${unitName}`, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            ...this.defaultHeaders
            }
        })

        return response
    }

    async getVehicleManufacturer(accessToken: string, manufacturerId: number) {
        const response = await this.request.get(`${process.env.HOMEPAGE_URL}api/crm/manufacturers/${manufacturerId}/`, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            ...this.defaultHeaders
            }
        })

        return response
    }

    async getUnitById(accessAdminToken: string, unitId: number) {
        const response = await this.request.get(`${process.env.HOMEPAGE_URL}api/crm/units/${unitId}/`, {
            headers: {
                Authorization: `Bearer ${accessAdminToken}`,
                ...this.defaultHeaders
            }
        })

        return response
    }

    async getUnitIds(limit: number): Promise<number[]> {
        const unitIds: number[] = [];
        let currentPage = 1;

        while (unitIds.length < limit) {
            const response = await this.request.get(`${process.env.HOMEPAGE_URL}api/units/?page=${currentPage}`);
            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            const approvedUnits = responseBody.results.filter((unit: { is_approved: boolean }) => unit.is_approved === true);
            const approvedUnitIds = approvedUnits.map((unit: { id: number }) => unit.id);

            unitIds.push(...approvedUnitIds);

            if (!responseBody.next) {
                break;
            }

            currentPage++;
        }

        return unitIds.slice(0, limit);
    }

    async addUnitsToFavorites(accessToken: string | null, unitIds: number[]) {
        for (const unitId of unitIds) {
            const response = await this.request.post(`${process.env.HOMEPAGE_URL}api/auth/users/${user_id}/favourite-units/${unitId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            expect(response.status()).toBe(201);
        }
    }

    async getFavoriteUnits(accessToken: string | null): Promise<number[]> {
        const response = await this.request.get(`${process.env.HOMEPAGE_URL}api/auth/users/${user_id}/favourite-units/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const favoriteUnitIds = responseBody.units.map((unit: { id: number }) => unit.id);

        return favoriteUnitIds;
    }

    async removeUnitsFromFavorites(accessToken: string | null, unitIds: number[]) {
        for (const unitId of unitIds) {
            try {
                const response = await this.request.delete(`${process.env.HOMEPAGE_URL}api/auth/users/${user_id}/favourite-units/${unitId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Connection: 'close',
                    },
                });

                expect(response.status()).toBe(204);

            } catch (error: any) {
                if (error.message.includes('aborted') || error.message.includes('closed')) {
                    continue;
                } else {
                    throw error;
                }
            }
        }
    }
}

export default ApiHelper;