import { useMemo, useState, useEffect } from 'react';
import ScreenBox from '../../components/ScreenBox';
import CategorySelect from '../../components/common/CategorySelect';
import TopHeader from '../../components/common/TopHeader';
import PostTimeLine from '../../components/common/PostTimeLine';
import { commuinityCategoryTabs } from '../../constants/category';
import Box from '@mui/material/Box';
import CreateFab from '../../components/CreateFab';
import { apis } from '../../apis';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useDdleContext } from '../../contexts/Ddle';

const Community = () => {
  const router = useRouter();
  const [entireFollows, setEntireFollows] = useState<any[]>([]);

  const selectedTab = Number(router.query.tab || 0);
  const { user } = useDdleContext();
  useEffect(() => {
    if (user)
      (async () => {
        const result = await apis.follow.getAllFollows({
          userId: user.id,
        });
        setEntireFollows(result);
      })();
  }, [user]);
  const filters = useMemo(() => {
    const base = {
      removed: {
        $ne: true,
      },
    };
    const addon =
      selectedTab === 0
        ? {
            createdAt: {
              $gte: dayjs().subtract(6, 'days').toISOString(),
            },
          }
        : selectedTab === 1
        ? {
            artist: {
              id: { $notNull: true },
            },
          }
        : selectedTab === 2
        ? {
            user: {
              id:
                entireFollows.length > 0
                  ? {
                      $in: entireFollows.map(({ targetId }) => targetId),
                    }
                  : { $eq: -1 },
            },
          }
        : {
            likingCount: {
              $gte: 3,
            },
          };
    return { ...base, ...addon };
  }, [selectedTab]);

  const result = apis.artistNote.useGetInfiniteList({
    query: {
      populate: [
        'user',
        'user.avatar',
        'artist',
        'artist.avatar',
        'artist.user',
        'images',
        'product',
        'product.thumbnails',
      ],
      sort: ['createdAt:desc'],
      filters,
    },
  });

  const onChangeCategoryHandler = (tabIndex: number) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab: tabIndex,
      },
    });
  };

  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);
  return (
    <>
      <ScreenBox footer>
        <TopHeader
          showSearch={true}
          showNotification={false}
          showLogo={false}
          title="커뮤니티"
        />

        <Box sx={{ overflow: 'hidden', width: '100%' }}>
          <CategorySelect
            size="large"
            tabs={commuinityCategoryTabs.map((item) => item.text)}
            selectedTab={selectedTab}
            onChange={onChangeCategoryHandler}
          />
        </Box>

        <PostTimeLine
          items={items}
          showAvatar={true}
          hasNextPage={result.hasNextPage}
          fetchNextPage={result.fetchNextPage}
          loading={result.isLoading}
          refetch={result.refetch}
          detailMode={false}
        />
        {user && <CreateFab href="/community/create" />}
      </ScreenBox>
    </>
  );
};
export default Community;
