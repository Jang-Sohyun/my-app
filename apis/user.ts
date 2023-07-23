import axios, { AxiosResponse } from 'axios';
import generateBaseRestApi from './generateBaseRestApi';
import { Receipient, StoreKey, User } from '../types';
import { request, getJwt } from './index';

const apis = generateBaseRestApi('users');

const getMe = (): Promise<AxiosResponse<User>> =>
  request.get<User>('/api/users/me', {
    params: {
      populate: ['*', 'avatar', 'artist.avatar', 'artist.background'],
    },
  });

const updateMe = async (data: Partial<User>) => {
  const { data: me } = await getMe();

  return request.put<Partial<User>, User>(`/api/users/${me.id}`, data);
};

const requestSmsVerification = async ({ phone }: { phone: string }) => {
  return await axios.post('/api/request-verification-code', {
    phone,
    jwt: getJwt(),
  });
  // return request.put<Partial<User>, User>(`/api/users/${me.id}`, data);
};
const verifySmsCode = async ({
  phone,
  code,
}: {
  phone: string;
  code: string;
}) => {
  const { data } = await request.get('/api/sms-verifications', {
    params: {
      'filters[phone][$eq]': phone,
      'filters[key][$eq]': code,
    },
  });
  return data;
};

const completeSignUp = async (data: Partial<User>): Promise<User> => {
  const { data: me } = await getMe();
  if (data.artistNo) {
    const { data: artists } = await request.get(`/api/artists`, {
      params: {
        'filters[code][$eq]': data.artistNo,
        'filters[user][$eq]': null,
      },
    });
    if (artists.data[0]) {
      try {
        await request.put(`/api/artists/${artists.data[0].id}`, {
          data: { user: me.id },
        });
      } catch (e) {
        console.error(e);
        throw new Error('잘못된 작가 번호입니다.');
      }
    } else {
      throw new Error('잘못된 작가 번호입니다.');
    }
  }
  return request.put<Partial<User>, User>(`/api/users/${me.id}`, data);
};

export default {
  getMe,
  updateMe,
  requestSmsVerification,
  verifySmsCode,
  completeSignUp,
  ...apis,
};
