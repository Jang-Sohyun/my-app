/* eslint-disable */

import { AxiosResponse } from 'axios';
import { request } from './index';
import { useQuery, useMutation, useInfiniteQuery } from 'react-query';
import qs from 'qs';

const get =
  (path: string) =>
  async (id: number, params?: any): Promise<AxiosResponse<any>> => {
    const query = params?.query
      ? `?${qs.stringify(params.query, {
          encodeValuesOnly: true,
        })}`
      : '';
    const { data } = await request.get(`/api/${path}/${id}${query}`);
    return data;
  };
const useGet =
  (path: string) =>
  (id: number, params?: any, config?: Parameters<typeof useQuery>[2]) =>
    useQuery(`${path}-get-${id}`, () => get(path)(id, params), config);

const getList =
  (path: string) =>
  async (props?: any): Promise<AxiosResponse<any>> => {
    const query = props?.query
      ? `?${qs.stringify(props.query, {
          encodeValuesOnly: true,
        })}`
      : '';
    const { data } = await request.get(`/api/${path}${query}`);
    return data;
  };
const useGetList =
  (path: string) => (params: any, config?: Parameters<typeof useQuery>[2]) =>
    useQuery(
      `${path}-getList-${params ? JSON.stringify(params) : ''}`,
      () => getList(path)(params),
      config
    );

const getCount =
  (path: string) =>
  async (props?: any): Promise<AxiosResponse<any>> => {
    const query = props?.query
      ? `?${qs.stringify(props.query, {
          encodeValuesOnly: true,
        })}`
      : '';
    const { data } = await request.get(`/api/${path}${query}`);
    const count = data?.meta?.pagination.total || 0;
    return count;
  };

const useGetCount =
  (path: string) => (params?: any, config?: Parameters<typeof useQuery>[2]) =>
    useQuery(
      `${path}-getCount-${params ? JSON.stringify(params) : ''}`,
      () => {
        let query = {};
        if (params?.query) {
          query = { ...query, ...params.query };
        }
        return getCount(path)({ query });
      },
      config
    );

const useGetInfiniteList =
  (path: string) =>
  (params: any, config?: Parameters<typeof useInfiniteQuery>[2]) =>
    useInfiniteQuery(
      `${path}-getInfiniteList-${params ? JSON.stringify(params) : ''}`,
      (parameters) => {
        return getList(path)({
          query: {
            ...params?.query,
            pagination: {
              page: parameters.pageParam,
              pageSize: 25,
            },
          },
        });
      },
      {
        getNextPageParam: (lastPage: any, pages) => {
          if (
            lastPage.meta.pagination.page >= lastPage.meta.pagination.pageCount
          )
            return undefined;
          return (pages.length || 0) + 1;
        },
        ...config,
      } as Parameters<typeof useInfiniteQuery>[2]
    );

const create =
  (path: string) =>
  async (body: any): Promise<AxiosResponse<any>> => {
    const { data } = await request.post(`/api/${path}`, { data: body });
    return data;
  };
const useCreate =
  (path: string) => (config?: Parameters<typeof useMutation>[2]) =>
    useMutation(create(path), config);

const update =
  (path: string) =>
  async ({ id, ...body }: any, config?: any): Promise<AxiosResponse<any>> => {
    const { data } = await request.put(
      `/api/${path}/${id}`,
      { data: body },
      config
    );
    return data;
  };
const useUpdate =
  (path: string) => (config?: Parameters<typeof useMutation>[2]) =>
    useMutation(update(path), config);

const remove =
  (path: string) =>
  async (id: number): Promise<AxiosResponse<any>> => {
    const { data } = await request.delete(`/api/${path}/${id}`);
    return data;
  };

const useRemove =
  (path: string) => (config?: Parameters<typeof useMutation>[2]) =>
    useMutation(remove(path), config);

const generateBaseRestApi = (path: string) => ({
  get: get(path),
  useGet: useGet(path),
  getList: getList(path),
  useGetList: useGetList(path),
  useGetInfiniteList: useGetInfiniteList(path),
  getCount: getCount(path),
  useGetCount: useGetCount(path),
  create: create(path),
  useCreate: useCreate(path),
  update: update(path),
  useUpdate: useUpdate(path),
  remove: remove(path),
  useRemove: useRemove(path),
});
export default generateBaseRestApi;
