import axios from 'axios';
import { StoreKey } from '../types';
import user from './user';
import refundAccount from './refundAccount';
import delivery from './delivery';
import artist from './artist';
import artistNote from './artistNote';
import likingNote from './likingNote';
import artistNoteComment from './artistNoteComment';
import cart from './cart';
import collection from './collection';
import follow from './follow';
import likingComment from './likingComment';
import likingProduct from './likingProduct';
import notification from './notification';
import order from './order';
import orderItems from './orderItems';
import orderCanceled from './orderCanceled';
import product from './product';
import productInquery from './productInquery';
import productTag from './productTag';
import purchasedReview from './purchasedReview';
import review from './review';
import notice from './notice';
import faq from './faq';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
});

const getJwt = () =>
  typeof window === 'undefined'
    ? null
    : window.localStorage.getItem(StoreKey.Jwt);

request.interceptors.request.use(
  function (config) {
    const jwt = getJwt();
    if (jwt) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${jwt}`,
      };
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

const upload = async (value): Promise<any> => {
  const form = new FormData();
  form.append('files', value, '1.png');

  const { data } = await request.post('/api/upload', form);
  return data[0];
};

const apis = {
  user,
  upload,
  delivery,
  refundAccount,
  artist,
  artistNote,
  likingNote,
  artistNoteComment,
  cart,
  collection,
  follow,
  likingComment,
  likingProduct,
  notification,
  order,
  orderItems,
  orderCanceled,
  product,
  productInquery,
  productTag,
  purchasedReview,
  review,
  notice,
  faq,
};

export { apis, getJwt, request };
