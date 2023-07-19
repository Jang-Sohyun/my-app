// import axios, { AxiosResponse } from 'axios';
// import { Receipient, StoreKey, User } from 'types';
// import { request, getJwt } from './index';

// const getDelivery = async (
//   userId: number
// ): Promise<AxiosResponse<Receipient>> => {
//   const { data: delivery } = await request.get('/api/deliveries', {
//     params: {
//       filter: { user: userId },
//     },
//   });
//   return delivery;
// };
// const createDelivery = async (
//   userId: number,
//   body: any
// ): Promise<AxiosResponse<Receipient>> => {
//   const { data: delivery } = await request.post('/api/deliveries', body);
//   return delivery;
// };
// const updateDelivery = async (
//   deliveryId: number,
//   body: any
// ): Promise<AxiosResponse<Receipient>> => {
//   const { data: delivery } = await request.put(
//     `/api/deliveries/${deliveryId}`,
//     body
//   );
//   return delivery;
// };

// export default {
//   get: getDelivery,
//   create: createDelivery,
//   update: updateDelivery,
// };

import generateBaseRestApi from './generateBaseRestApi';

const apis = generateBaseRestApi('deliveries');

export default apis;
