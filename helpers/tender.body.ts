import { faker } from '@faker-js/faker'

export const createTenderData = () => {
    const startProposeDate = new Date();
    const endProposeDate = new Date();
    const startTenderDate = new Date();
    const endTenderDate = new Date();
    const tenderName = faker.lorem.words({min: 3, max: 4});
    const tenderDescription = faker.lorem.sentences({min: 3, max: 4});

    startProposeDate.setDate(startProposeDate.getDate() + 1)
    endProposeDate.setDate(startProposeDate.getDate() + 2);
    startTenderDate.setDate(endProposeDate.getDate() + 1);
    endTenderDate.setDate(startProposeDate.getDate() + 20);

    const tenderData = {
        name: tenderName,
        description: tenderDescription,
        lat: 50.4501,
        lng: 30.5234,
        amount_of_work: '1000 square meters',
        start_price: 5000,
        currency: 'UAH',
        payment_method: 'cash',
        type_of_work: 'HOUR',
        time_of_work: 'FOUR',
        close_request: false,
        start_propose_date: startProposeDate.toISOString(),
        end_propose_date: endProposeDate.toISOString(),
        start_tender_date: startTenderDate.toISOString(),
        end_tender_date: endTenderDate.toISOString(),
        customer: 1776, 
        category: 5, 
        services: [438], 
        is_moderated: false,
      };
    
      return tenderData;
}