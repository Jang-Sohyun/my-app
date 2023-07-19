import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import { Box, Stack, Typography, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { KeyboardArrowRight } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { apis } from 'apis';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDdleContext } from 'contexts/Ddle';
import { useMemo } from 'react';
import OrderListComp from 'components/OrderList';

const OrderList = (props: any) => {
  return (
    <Stack
      sx={{
        width: '100%',
        pt: '18px',
        pb: '14px',
        borderBottom: '1px solid rgb(230, 230, 230)',
        position: 'relative',
      }}
      role="button"
      onClick={props.onClick}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          mb: '18px',
        }}
      >
        <Typography
          sx={{
            fontSize: '14px',
            color: (theme) => theme.palette.grey[500],
            flex: 1,
          }}
        >
          {dayjs(props.datetime).format('YYYY. MM. DD')}
        </Typography>
        {props.isConfirmed && (
          <Chip
            label="구매 확정"
            sx={{ padding: '6px 10px', fontSize: '12px' }}
          />
        )}
      </Stack>

      <Stack spacing={1}>
        <OrderListComp items={props.items} />
        {/* {props.items.map((item: any, i: number) => (
          <OrderItem
            key={i}
            image={item.image}
            name={item.name}
            artist={item.artist}
          />
        ))} */}
      </Stack>
      {props.onClick ? (
        <KeyboardArrowRight
          sx={{ position: 'absolute', right: 0, top: '74px', opacity: 0.3 }}
        />
      ) : null}
    </Stack>
  );
};

type Props = {
  onClickGoBack: () => void;
};
const OrderHistory = (props: Props) => {
  const router = useRouter();
  const { user } = useDdleContext();
  const { data, fetchNextPage, hasNextPage } = apis.order.useGetInfiniteList(
    {
      query: {
        populate: [
          'order_items',
          'order_items.product',
          'order_items.product.artist',
          'order_items.product.thumbnails',
          'delivery',
        ],
        sort: ['createdAt:DESC'],
        filters: {
          user: {
            id: {
              $eq: user?.id,
            },
          },
          isPaid: {
            $eq: true,
          },
        },
      },
    },
    { enabled: Boolean(user) }
  );
  const items = useMemo(() => {
    const pages = data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [data]);
  return (
    <ScreenBox>
      <BasicAppBar title="주문 내역" />
      <Box sx={{ px: '20px', width: '100%' }}>
        {items.length > 0 ? (
          <InfiniteScroll
            dataLength={items?.length || 0} //This is important field to render the next data
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<h4>로딩 중</h4>}
          >
            {items.map((item, i) => (
              <OrderList
                key={item.id}
                datetime={item.attributes.createdAt}
                items={item.attributes.order_items.data}
                isConfirmed={item.attributes.isConfirmed}
                onClick={() => {
                  router.push(`/profile/orders/${item.id}`);
                }}
              />
            ))}
          </InfiniteScroll>
        ) : (
          <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
            <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
              주문 내역이 없습니다.
            </Typography>
          </Stack>
        )}
      </Box>
    </ScreenBox>
  );
};

export default OrderHistory;
