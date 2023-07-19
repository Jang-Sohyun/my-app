import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import { Stack, Button, Typography } from '@mui/material';
import { useMemo } from 'react';
import ProductSaleList from 'components/ProductSaleList';
import { useRouter } from 'next/router';
import { apis } from 'apis';
import { useDdleContext } from 'contexts/Ddle';

const Update = () => {
  const { user } = useDdleContext();
  const router = useRouter();
  const result = apis.product.useGetInfiniteList(
    {
      query: {
        populate: ['images', 'artist', 'thumbnails'],
        sort: ['createdAt:DESC'],
        filters: {
          artist: {
            id: {
              $eq: user?.artist?.id,
            },
          },
        },
      },
    },
    { enabled: Boolean(user?.artist?.id) }
  );
  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);
  return (
    <ScreenBox>
      <BasicAppBar
        title="판매 작품 수정"
        rightComponent={
          <Button
            variant="contained"
            sx={{ borderRadius: 8, position: 'absolute', right: 12 }}
            onClick={() => {
              router.push('/profile/sales/create');
            }}
          >
            생성
          </Button>
        }
      />

      <Stack
        sx={{ px: '12px', pb: '20%', pt: '0px', width: '100%' }}
        spacing={2}
      >
        {items.length > 0 ? (
          <ProductSaleList
            items={items}
            fetchNextPage={result.fetchNextPage}
            hasNextPage={result.hasNextPage}
            onClickUpdate={(item) => {
              router.push({
                pathname: '/profile/sales/create',
                query: { id: item.id },
              });
            }}
          />
        ) : (
          <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
            <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
              판매중인 상품이 없습니다.
            </Typography>
          </Stack>
        )}
      </Stack>
    </ScreenBox>
  );
};

export default Update;
