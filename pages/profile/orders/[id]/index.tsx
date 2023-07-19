import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import {
  Box,
  Stack,
  Typography,
  Button,
  ButtonGroup,
  Divider,
} from '@mui/material';
import dayjs from 'dayjs';
import { KeyboardArrowRight } from '@mui/icons-material';
import comma from 'libs/comma';
import BottomSheet from 'components/BottomSheet';
import { useEffect, useState } from 'react';
import { WriteIcon } from 'components/svgIcons';
import Alert from 'components/Alert';
import { useRouter } from 'next/router';
import OrderItem from 'components/OrderItem';
import { useDdleContext } from 'contexts/Ddle';
import { apis } from 'apis';
import { useSnackbar } from 'notistack';
import { useContext as useConfirm } from 'contexts/confirm';
import OrderList from 'components/OrderList';
import { CS_MAIL } from 'constants/service';

const DataListItem = ({ name, value, valueSx }: any) => (
  <Stack key={name} direction="row">
    <Box sx={{ width: '25%' }}>
      <Typography
        sx={{
          fontSize: '14px',
          color: (theme) => theme.palette.grey[500],
        }}
      >
        {name}
      </Typography>
    </Box>
    <Typography
      sx={{
        width: '75%',
        fontSize: '14px',
        color: (theme) => theme.palette.grey[500],
        fontWeight: 'bold',
        ...valueSx,
      }}
    >
      {value}
    </Typography>
  </Stack>
);
const OrderDetail = ({ order }: any) => {
  const router = useRouter();

  const [alertOpen, setAlertOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, confirm] = useConfirm();

  const isReviewed = order.attributes.isReviewed;
  const isCanceled = order.attributes.isCanceled;

  const [isConfirmed, setIsConfirmed] = useState(order.attributes.isConfirmed);

  const isNotValid =
    !order || !order.attributes.isPaid || order.attributes.isCanceled;
  useEffect(() => {
    if (isNotValid) {
      alert('유효하지 않은 주문입니다.');
      router.replace('/');
    }
  }, [isNotValid]);

  const reviewAvailable = isConfirmed && !isReviewed;

  return (
    <ScreenBox footer>
      <BasicAppBar
        title="주문 상세"
        onClickGoBack={
          router.query['from-order']
            ? () => {
                router.replace('/');
              }
            : null
        }
      />
      <Box sx={{ px: '20px', width: '100%' }}>
        <Stack>
          <Typography
            sx={{
              fontSize: '14px',
              color: (theme) => theme.palette.grey[500],
            }}
          >
            주문번호 {order.id}
          </Typography>
          <Typography
            sx={{ fontSize: '14px', color: (theme) => theme.palette.grey[500] }}
          >
            {dayjs(order.attributes.createdAt).format('YYYY. MM. DD')}
          </Typography>
        </Stack>
        {isConfirmed ? (
          order.attributes.order_items.data.map((item) => {
            const alreadyReviewed = item.attributes.purchased_review.data;
            return (
              <Box
                key={item.id}
                sx={{
                  pt: '18px',
                }}
              >
                <OrderList items={[item]} />
                <Button
                  fullWidth
                  disableRipple
                  sx={{
                    my: '18px',
                    borderRadius: '12px',
                    border: '1px solid rgb(230, 230, 230)',
                    color: (theme) => theme.palette.grey[400],
                    ':hover, :active': {
                      color: (theme) => theme.palette.grey[900],
                      border: '1px solid rgb(230, 230, 230)',
                      fontWeight: 'bold',
                    },
                  }}
                  onClick={() => {
                    if (alreadyReviewed) {
                      router.push(
                        `/artist/${item.attributes.product.data.attributes.artist.data.id}/curatings/${item.attributes.purchased_review.data.id}`
                      );
                    } else {
                      router.push(
                        `/profile/orders/${order.id}/review?order-item=${item.id}`
                      );
                    }
                  }}
                  //
                >
                  {alreadyReviewed ? '작성한 리뷰 보기' : '리뷰 작성하기'}
                </Button>
              </Box>
            );
          })
        ) : (
          <Box
            sx={{
              pt: '18px',
            }}
          >
            <OrderList items={order.attributes.order_items.data} />
          </Box>
        )}
        {isReviewed || isConfirmed ? null : isCanceled ? (
          <Button
            fullWidth
            disableRipple
            sx={{
              my: '18px',
              borderRadius: '12px',
              border: '1px solid rgb(230, 230, 230)',
              color: (theme) => theme.palette.grey[400],
              ':hover, :active': {
                color: (theme) => theme.palette.grey[900],
                border: '1px solid rgb(230, 230, 230)',
                fontWeight: 'bold',
              },
            }}
            onClick={() => {
              if (isCanceled) {
              } else if (isReviewed) {
              } else if (isConfirmed) {
                setIsReviewed(true);
              } else {
              }
            }}
          >
            {isCanceled
              ? '취소 완료'
              : isCancelling
              ? '주문 취소 진행'
              : isReviewed
              ? '작성한 리뷰보기'
              : isConfirmed
              ? '리뷰 작성하기'
              : ''}
          </Button>
        ) : (
          <ButtonGroup
            fullWidth
            disableRipple
            sx={{
              my: '18px',
              '& .MuiButtonBase-root': {
                borderRadius: '12px',
              },
            }}
          >
            <Button
              sx={{
                border: '1px solid rgb(230, 230, 230)',
                borderRightWidth: 0,
                color: (theme) => theme.palette.grey[400],
                ':hover, :active': {
                  color: (theme) => theme.palette.grey[900],
                  border: '1px solid rgb(230, 230, 230)',
                  borderRightWidth: 0,
                  fontWeight: 'bold',
                },
              }}
              onClick={() => {
                router.push(`/profile/orders/${router.query.id}/cancel`);
              }}
            >
              주문취소
            </Button>
            <Button
              sx={{
                borderTop: '1px solid rgb(230, 230, 230)',
                borderBottom: '1px solid rgb(230, 230, 230)',
                borderRightWidth: 0,
                borderLeftWidth: 0,
                color: (theme) => theme.palette.grey[400],
                ':hover, :active': {
                  color: (theme) => theme.palette.grey[900],
                  borderTop: '1px solid rgb(230, 230, 230)',
                  borderBottom: '1px solid rgb(230, 230, 230)',
                  borderRightWidth: 0,
                  borderLeftWidth: 0,
                  fontWeight: 'bold',
                },
              }}
              onClick={() => {
                confirm
                  .open({
                    title: '구매확정',
                    body: `구매확정 시, 교환 및 반품이 불가하므로\n반드시 작품을 배송 받으신 후 진행해주세요.`,
                    buttons: [
                      {
                        label: '취소',
                      },
                      {
                        label: '완료',
                        isDanger: true,
                      },
                    ],
                  })
                  .then(async (confirm) => {
                    if (confirm === '완료') {
                      await apis.order.update({
                        id: order.id,
                        isConfirmed: true,
                      });
                      setIsConfirmed(true);
                      setDrawerOpen(true);
                    }
                  });
                setAlertOpen(true);
              }}
            >
              구매확정
            </Button>
            <Button
              sx={{
                border: '1px solid rgb(230, 230, 230)',
                borderLeftWidth: 0,
                color: (theme) => theme.palette.grey[400],
                ':hover, :active': {
                  color: (theme) => theme.palette.grey[900],
                  border: '1px solid rgb(230, 230, 230)',
                  borderLeftWidth: 0,
                  fontWeight: 'bold',
                },
              }}
              onClick={() => {
                window.location.href = `mailto:${CS_MAIL}`;
              }}
            >
              문의하기
            </Button>
          </ButtonGroup>
        )}

        <Stack sx={{ pt: '14px' }} spacing={1.7}>
          <Typography
            sx={{
              fontSize: '16px',
              color: (theme) => theme.palette.grey[500],
              fontWeight: 'bold',
            }}
          >
            배송지 정보
          </Typography>
          <DataListItem
            name="받는 분"
            value={order.attributes.delivery.data.attributes.recipient}
          />
          <DataListItem
            name="전화"
            value={order.attributes.delivery.data.attributes.mobile}
          />
          <DataListItem
            name="주소"
            value={order.attributes.delivery.data.attributes.address}
          />
          <DataListItem
            name="배송 메모"
            value={order.attributes.delivery.data.attributes.memo}
          />
        </Stack>
        <Divider sx={{ mt: '14px' }} />
        <Stack sx={{ pt: '14px' }} spacing={1.7}>
          <Typography
            sx={{
              fontSize: '16px',
              color: (theme) => theme.palette.grey[500],
              fontWeight: 'bold',
            }}
          >
            결제 정보
          </Typography>
          <DataListItem
            name="상품 금액"
            value={`${comma(order.attributes.price)}원`}
            valueSx={{
              textAlign: 'right',
            }}
          />
          <DataListItem
            name="할인"
            value={`${comma(order.attributes.discountedAmount)}원`}
            valueSx={{
              textAlign: 'right',
            }}
          />
          <DataListItem
            name="배송비"
            value={`${comma(order.attributes.deliveryPrice)}원`}
            valueSx={{
              textAlign: 'right',
            }}
          />
          <DataListItem
            name="총 결제금액"
            value={`${comma(order.attributes.paidPrice)}원`}
            valueSx={{
              textAlign: 'right',
              color: (theme) => theme.palette.grey[900],
            }}
          />
        </Stack>

        <Button
          size="large"
          variant="contained"
          sx={{
            borderRadius: 12,
            background: 'rgb(14, 12, 39)',
            boxShadow: 'none',
            marginTop: 4,
            py: 2,
            width: '100%',
          }}
          onClick={async () => {
            router.push('/');
          }}
        >
          메인으로 가기
        </Button>
      </Box>

      <BottomSheet
        open={drawerOpen}
        onOpen={() => {
          setDrawerOpen(true);
        }}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <Stack alignItems={'center'} sx={{ pt: '32px' }}>
          <Typography
            sx={{
              color: (theme) => theme.palette.grey[800],
              fontWeight: 'bold',
              pb: '12px',
            }}
          >
            구매확정 완료
          </Typography>
          <WriteIcon sx={{ fontSize: '64px', mb: '12px' }} />
          <Typography
            sx={{
              color: (theme) => theme.palette.grey[700],
              fontSize: '15px',
            }}
          >
            배송 받으신 작품은 어떠셨나요 ?
          </Typography>
          <Typography
            sx={{
              color: (theme) => theme.palette.grey[500],
              fontSize: '13px',
              pb: '40px',
            }}
          >
            3줄 큐레이팅으로 간편하고 빠르게 후기를 남겨주세요!
          </Typography>
          <Box sx={{ px: '22px', width: '100%' }}>
            <Button
              size="large"
              variant="contained"
              sx={{
                background: 'rgb(14, 12, 39)',
                '&:hover, &:active': {
                  background: 'rgb(14, 12, 39)',
                },
                mb: '30px',
                borderRadius: '20px',
              }}
              fullWidth
              onClick={() => {
                setDrawerOpen(false);
                // router.push(`/profile/orders/${order.id}/review`);
              }}
            >
              리뷰 작성하기
            </Button>
          </Box>
        </Stack>
      </BottomSheet>
    </ScreenBox>
  );
};

export async function getServerSideProps(context) {
  try {
    const orderId = context.params.id;
    const { data: order } = await apis.order.get(Number(orderId), {
      query: {
        populate: [
          '*',
          'order_items',
          'order_items.product',
          'order_items.product.artist',
          'order_items.product.thumbnails',
          'order_items.purchased_review',
          'delivery',
        ],
      },
    });
    return {
      // Passed to the page component as props
      props: { order },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        error: e.message,
      },
    };
  }
}
export default OrderDetail;
