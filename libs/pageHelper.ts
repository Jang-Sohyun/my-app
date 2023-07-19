export const DefaultPageSize = 1000;

interface GetFromToParams {
  pageSize?: number;
  page: number;
}

export const getFromTo = (
  { pageSize = DefaultPageSize, page = 0 }: GetFromToParams = {
    pageSize: DefaultPageSize,
    page: 0,
  }
) => {
  const from = pageSize * page;
  const to = pageSize * (page + 1) - 1;
  return {
    from,
    to,
    pageSize,
    page,
  };
};
