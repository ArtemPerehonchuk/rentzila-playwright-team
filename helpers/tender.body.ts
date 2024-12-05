

export const createTenderData = () => {
    const startProposeDate = new Date();
    const endProposeDate = new Date();
    const startTenderDate = new Date();
    const endTenderDate = new Date();

    startProposeDate.setDate(startProposeDate.getDate() + 1)
    endProposeDate.setDate(startProposeDate.getDate() + 2);
    startTenderDate.setDate(endProposeDate.getDate() + 1);
    endTenderDate.setDate(startProposeDate.getDate() + 20);

    const tenderData = {
        name: 'New Construction Project',
        description: 'This is a detailed description of the tender for a new construction project.',
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
        customer: 1776, // Replace with dynamic customer ID
        category: 5, // Replace with dynamic category ID
        services: [438], // Replace with relevant service IDs
        is_moderated: false,
      };
    
      return tenderData;
}