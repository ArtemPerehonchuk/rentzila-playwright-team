import { test, expect } from "../fixtures";
import testData from '../data/test.data.json' assert {type: 'json'};
import { faker } from "@faker-js/faker";
import ApiHelper from "../helpers/api.helper";

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';

let userAccessToken: string;
let adminAccessToken: string;

test.beforeAll(async ({apiHelper}) => {
    userAccessToken = await apiHelper.createUserAccessToken();
    adminAccessToken = await apiHelper.createAdminAccessToken()
})

test.beforeEach('test', async ({apiHelper, homepage}) => {
    await homepage.loginUser(VALID_EMAIL, VALID_PASSWORD);

    const createdTender = await apiHelper.createTender(userAccessToken);
    const createdTenderId = createdTender.id

    await apiHelper.addFileToTender(userAccessToken, createdTenderId, faker.lorem.word());
    await apiHelper.moderateTenderStatus(adminAccessToken, createdTenderId, 'declined');
    // await apiHelper.getTenderById(userAccessToken, createdTenderId)
    //await apiHelper.getTendersList(userAccessToken);
})

test('Test case C238: Edit the rejected tender with valid values (default contact person)', async({apiHelper, homepage}) => {

})