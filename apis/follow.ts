import { useDdleContext } from '../contexts/Ddle';
import { useRef } from 'react';
import generateBaseRestApi from './generateBaseRestApi';

const apis = generateBaseRestApi('follows');

const useFollow = (followTargetId: number) => {
  const { user, requestLogin } = useDdleContext();
  const {
    data: followData,
    refetch: refetchFollow,
    isLoading: loadingFollow,
    isRefetching: refetchigFollow,
  } = apis.useGetList(
    {
      query: {
        filters: {
          follow_target: {
            id: {
              $eq: followTargetId,
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
  const item = followData?.data?.[0];
  const isFollowed = Boolean(item);
  const loadingRef = useRef<boolean>();

  const follow = async () => {
    if (user) {
      if (!loadingRef.current && !loadingFollow && !refetchigFollow) {
        try {
          loadingRef.current = true;
          if (item) {
            await apis.remove(item.id);
          } else {
            await apis.create({
              follow_target: followTargetId,
              user: user.id,
            });
          }
        } catch (e) {
          alert(e.message);
        } finally {
          refetchFollow();
          loadingRef.current = false;
        }
      }
    } else {
      requestLogin();
    }
  };

  return {
    item,
    isFollowed,
    follow,
  };
};
interface FollowItem {
  id?: number | null;
  artistId?: number | null;
  targetId: number;
  nickname: string;
  avatarUrl: string;
  subscribed: boolean;
}
const getAllFollows = async ({ userId }: { userId: number }) => {
  const items: FollowItem[] = [];
  let page = 1;
  let pageCount = 1;
  do {
    const { data, meta } = await apis.getList({
      query: {
        populate: [
          'user',
          'user.avatar',
          'follow_target',
          'follow_target.avatar',
          'follow_target.artist',
        ],
        sort: ['createdAt:desc'],
        filters: {
          user: {
            id: {
              $eq: userId,
            },
          },
        },
        pagination: {
          page,
        },
      },
    });
    pageCount = meta.pagination.pageCount;
    for (const item of data) {
      items.push({
        id: item.id,
        targetId: item.attributes.follow_target.data.id,
        nickname: item.attributes.follow_target.data.attributes.nickname,
        avatarUrl: item.attributes.follow_target.data.attributes.url,
        subscribed: true,
        artistId: item.attributes.follow_target.data.attributes.artist.data?.id,
      });
    }
  } while (page++ < pageCount);
  return items;
};

export default { ...apis, getAllFollows, useFollow };
