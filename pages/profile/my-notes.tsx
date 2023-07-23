import { useMemo } from 'react';
import BottomMenu from '../../components/common/BottomMenu';
import ScreenBox from '../../components/ScreenBox';
import BasicAppBar from '../../components/common/BasicAppBar';
import PostTimeLine from '../../components/common/PostTimeLine';
import { useDdleContext } from '../../contexts/Ddle';
import { apis } from '../../apis';

const Page = () => {
  const { user } = useDdleContext();
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
      filters: {
        removed: {
          $ne: true,
        },
        user: {
          id: {
            $eq: user?.id,
          },
        },
      },
    },
  });
  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);
    return [];
  }, [result]);
  return (
    <>
      <ScreenBox>
        <BasicAppBar title="나의 노트" />

        <PostTimeLine
          items={items}
          hasNextPage={result.hasNextPage}
          fetchNextPage={result.fetchNextPage}
          loading={result.isLoading}
          refetch={result.refetch}
          detailMode
        />
      </ScreenBox>
    </>
  );
};

export default Page;
