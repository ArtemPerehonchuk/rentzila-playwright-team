import { test, expect } from "../fixtures";
import testData from '../data/test.data.json' assert {type: 'json'};

const VALID_EMAIL: string = process.env.VALID_EMAIL || '';
const VALID_PASSWORD: string = process.env.VALID_PASSWORD || '';

let userAccessToken: string;

test.beforeAll(async ({apiHelper}) => {
    userAccessToken = await apiHelper.createUserAccessToken();
})

// test('test', async ({apiHelper, homepage}) => {
//     await homepage.loginUser(VALID_EMAIL, VALID_PASSWORD);
//     await apiHelper.createTender(userAccessToken)
//     //await apiHelper.getTendersList(userAccessToken);
// })