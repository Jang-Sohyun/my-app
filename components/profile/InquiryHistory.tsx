import { useState, useEffect, useMemo } from 'react';
import { initalQnaLists } from '../../constants/mockData';
import { apis } from '../../apis';
import { useDdleContext } from '../../contexts/Ddle';
import { useSnackbar } from 'notistack';
import NestedListWithCollabse from './NestedListWithCollabse';

const InquiryHistory = (props: any) => {
  const [list, setList] = useState([]);
  const { user } = useDdleContext();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    // TODO : FAQ 목록 조회 API 받아오기
    setList(initalQnaLists);
  }, []);

  const handleClick = (id: string) => {
    // 해당하는 아이템의 isOpened 상태를 바꿔준다.
    // 해당하지 않는 아이템은 모두 닫아준다(isOpened = false)
    const newList = list.map((item) => {
      if (item.id == id) {
        item.isOpened = !item.isOpened;
      } else {
        item.isOpened = false;
      }

      return item;
    });

    setList(newList);
  };
  const productsResult = apis.productInquery.useGetInfiniteList(
    {
      query: {
        populate: ['*'],
        sort: ['createdAt:DESC'],
        filters: props.answerMode
          ? {
              artist: {
                id: {
                  $eq: user?.artist?.id,
                },
              },
            }
          : {
              user: {
                id: {
                  $eq: user?.id,
                },
              },
            },
      },
    },
    { enabled: Boolean(user) }
  );
  const inqueries = useMemo(() => {
    const pages = productsResult?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [productsResult]);

  const update = apis.productInquery.useUpdate();
  return (
    <NestedListWithCollabse
      type="inquiry_history"
      // list={list}
      list={inqueries?.map(({ id, attributes }) => ({
        id,
        status: attributes.answer ? '답변완료' : '진행중',
        title: attributes.title,
        body: attributes.desc,
        createdAt: attributes.createdAt,
        answered: attributes.answer,
      }))}
      onClickList={handleClick}
      onAnswer={
        props.answerMode
          ? async ({ id, text }) => {
              try {
                await update.mutateAsync({
                  id,
                  answer: text,
                });
                enqueueSnackbar('답변을 달았습니다.');
              } catch (e) {
                alert(e.message);
              } finally {
                productsResult.refetch();
              }
            }
          : null
      }
    />
  );
};

export default InquiryHistory;
