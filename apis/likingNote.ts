import generateBaseRestApi from './generateBaseRestApi';

import { useDdleContext } from '../contexts/Ddle';
import { useRef } from 'react';

const apis = generateBaseRestApi('liking-notes');

const useLike = (id: number) => {
  const { user, requestLogin } = useDdleContext();
  const {
    data: likeData,
    refetch: refetchLike,
    isLoading: loadingLike,
    isRefetching: refetchigLike,
  } = apis.useGetList(
    {
      query: {
        filters: {
          artist_note: {
            id: {
              $eq: id,
            },
          },
          user: {
            id: {
              $eq: user?.id,
            },
          },
        },
        pagination: {
          pageSize: 1,
        },
      },
    },
    { enabled: Boolean(user) }
  );
  const {
    data: count,
    refetch: refetchLikeCount,
    isLoading: loadingLikeCount,
    isRefetching: refetchigLikeCount,
  } = apis.useGetCount({
    query: {
      filters: {
        artist_note: {
          id: {
            $eq: id,
          },
        },
      },
    },
  });
  const item = likeData?.data?.[0];
  const isLiked = Boolean(item);
  const loadingRef = useRef<boolean>();

  const like = async () => {
    if (user) {
      if (
        !loadingRef.current &&
        !loadingLike &&
        !loadingLikeCount &&
        !refetchigLike &&
        !refetchigLikeCount
      ) {
        try {
          loadingRef.current = true;
          if (item) {
            await apis.remove(item.id);
          } else {
            await apis.create({
              artist_note: id,
              user: user.id,
            });
          }
        } catch (e) {
          alert(e.message);
        } finally {
          refetchLike();
          refetchLikeCount();
          loadingRef.current = false;
        }
      }
    } else {
      requestLogin();
    }
  };

  return {
    item,
    isLiked,
    count,
    like,
  };
};

export default { ...apis, useLike };
