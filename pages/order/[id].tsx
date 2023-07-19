import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import { Box, Stack, Typography, Button, Divider } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';
import comma from 'libs/comma';
import { useEffect, useState } from 'react';
import Alert from 'components/Alert';
import { useRouter } from 'next/router';
import OrderItem from 'components/OrderItem';
import AddressChanger from 'components/AddressChanger';
import { useDdleContext } from 'contexts/Ddle';
import { apis } from 'apis';
import { useSnackbar } from 'notistack';
import { useContext as useConfirm } from 'contexts/confirm';

const OrderList = (props: any) => {
  return (
    <Stack
      sx={{
        width: '100%',
        position: 'relative',
      }}
      role="button"
      onClick={props.onClick}
    >
      <Stack spacing={1}>
        {props.items.map((item: any, i: number) => (
          <OrderItem
            key={i}
            image={item.image}
            name={item.name}
            artist={item.artist}
            optionLabel={item.optionLabel}
            price={item.price}
            quantity={item.quantity}
          />
        ))}
      </Stack>
      {props.onClick ? (
        <KeyboardArrowRight
          sx={{ position: 'absolute', right: 0, top: '74px', opacity: 0.3 }}
        />
      ) : null}
    </Stack>
  );
};

const paymentData = {
  price: 10000,
  discount: 2000,
  delivery: 3000,
  overall: 11000,
};
const DataListItem = ({ name, value, valueSx }: any) => (
  <Stack key={name} direction="row">
    <Box sx={{ width: '25%' }}>
      <Typography
        sx={{
          fontSize: '12px',
          color: (theme) => theme.palette.grey[500],
        }}
      >
        {name}
      </Typography>
    </Box>
    <Typography
      sx={{
        width: '75%',
        fontSize: '12px',
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
  const { user } = useDdleContext();

  useEffect(() => {
    if (order.attributes.isCanceled) {
      alert('취소된 주문입니다.');
      router.back();
    } else if (order.attributes.isPaid) {
      alert('결제 완료된 주문입니다.');
      router.back();
    }
  }, [order]);

  const { data: deliveries, refetch: refetchDeliveries } =
    apis.delivery.useGetList(
      {
        query: {
          filters: {
            user: {
              id: {
                $eq: user?.id,
              },
            },
          },
        },
      },
      {
        enabled: Boolean(user),
      }
    );
  const delivery = deliveries?.data ? deliveries.data[0] : null;

  const receiverData = delivery
    ? {
        isValid: true,
        name: delivery.attributes.recipient,
        phone: delivery.attributes.mobile,
        address: delivery.attributes.address,
        memo: delivery.attributes.memo,
      }
    : {
        isValid: false,
        name: '',
        phone: '',
        address: '',
        memo: '',
      };

  const [alertOpen, setAlertOpen] = useState(false);
  const [addressChangerOpen, setAddressChangerOpen] = useState(false);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [, confirm] = useConfirm();

  const { enqueueSnackbar } = useSnackbar();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'phone'>(
    'card'
  );

  useEffect(() => {
    if (paymentData.overall >= 2000000) {
      setPaymentMethod('cash');
    }
  }, [paymentData]);

  useEffect(() => {
    if (router.isReady && router.query.message) {
      alert(decodeURIComponent(router.query.message));
      router.replace(`/order/${router.query.id}`);
    }
  }, [router.isReady, router.query]);

  const orderItems = order.attributes.order_items.data;
  const productsPrice = orderItems.reduce((acc, val) => {
    const product = val.attributes.product.data.attributes.price;
    return acc + product * val.attributes.amount;
  }, 0);
  const discountedAmount = 0;
  const deliveryFee = 0;
  const paymentPrice = productsPrice;

  const orderPossible =
    Boolean(receiverData.isValid) &&
    order &&
    !order.attributes.isPaid &&
    !order.attributes.isCanceled;

  return (
    <ScreenBox footer>
      <BasicAppBar title="주문 상세" />
      <Box sx={{ px: '20px', width: '100%' }}>
        <Stack>
          <Typography
            sx={{
              fontSize: '14px',
              color: (theme) => theme.palette.grey[500],
            }}
          >
            주문상품
          </Typography>
        </Stack>
        <Box
          sx={{
            pt: '18px',
          }}
        >
          <OrderList
            items={orderItems.map((orderItem) => {
              const product = orderItem.attributes.product.data;
              const item = {
                image: product.attributes.thumbnails.data[0].attributes.url,
                name: product.attributes.name,
                artist: product.attributes.artist.data.attributes.nickname,
                optionLabel: '',
                price: product.attributes.price,
                quantity: orderItem.attributes.amount,
              };
              return item;
            })}
          />
        </Box>
        <Divider sx={{ mt: '16px' }} />

        <Stack sx={{ pt: '14px' }} spacing={1.7}>
          <Stack direction="row" alignItems="center">
            <Typography
              sx={{
                fontSize: '14px',
                color: (theme) => theme.palette.grey[500],
                fontWeight: 'bold',
                flex: 1,
              }}
            >
              배송지 정보
            </Typography>
            <Button
              sx={{ fontWeight: 'bold' }}
              onClick={() => {
                setAddressChangerOpen(true);
              }}
            >
              변경하기
            </Button>
          </Stack>
          {receiverData.isValid ? (
            <>
              <DataListItem name="받는 분" value={receiverData.name} />
              <DataListItem name="전화" value={receiverData.phone} />
              <DataListItem name="주소" value={receiverData.address} />
              <DataListItem name="배송 메모" value={receiverData.memo} />
            </>
          ) : (
            <Typography
              sx={{
                fontSize: '12px',
                color: (theme) => theme.palette.grey[500],
              }}
            >
              배송지를 입력 해 주세요.
            </Typography>
          )}
          {/* <TextInput size='small' label="배송 메모" /> */}
        </Stack>
        <Divider sx={{ mt: '14px' }} />
        <Stack sx={{ pt: '14px' }} spacing={1.7}>
          <Typography
            sx={{
              fontSize: '14px',
              color: (theme) => theme.palette.grey[500],
              fontWeight: 'bold',
            }}
          >
            결제 정보
          </Typography>
          <DataListItem
            name="상품 금액"
            value={`${comma(productsPrice)}원`}
            valueSx={{
              textAlign: 'right',
            }}
          />
          <DataListItem
            name="할인"
            value={`${comma(discountedAmount)}원`}
            valueSx={{
              textAlign: 'right',
            }}
          />
          <DataListItem
            name="배송비"
            value={`${comma(deliveryFee)}원`}
            valueSx={{
              textAlign: 'right',
            }}
          />
          <DataListItem
            name="총 결제금액"
            value={`${comma(paymentPrice)}원`}
            valueSx={{
              textAlign: 'right',
              color: (theme) => theme.palette.grey[900],
            }}
          />
        </Stack>
        <Divider sx={{ mt: '14px' }} />
        <Stack sx={{ pt: '14px' }} spacing={1.7}>
          <Typography
            sx={{
              fontSize: '14px',
              color: (theme) => theme.palette.grey[500],
              fontWeight: 'bold',
            }}
          >
            결제 방법
          </Typography>
          <Stack direction="row" spacing={1.2}>
            <Button
              variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
              sx={{ borderRadius: '12px' }}
              onClick={() => {
                setPaymentMethod('card');
              }}
              disabled={paymentData.overall >= 2000000}
            >
              카드 결제
            </Button>
            <Button
              variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
              sx={{ borderRadius: '12px' }}
              onClick={() => {
                setPaymentMethod('cash');
              }}
            >
              무통장 결제
            </Button>
            <Button
              variant={paymentMethod === 'phone' ? 'contained' : 'outlined'}
              sx={{ borderRadius: '12px' }}
              onClick={() => {
                setPaymentMethod('phone');
              }}
              disabled={paymentData.overall >= 2000000}
            >
              휴대폰 결제
            </Button>
          </Stack>
          <ul style={{ paddingLeft: 20, fontSize: 12, marginBottom: '24px' }}>
            <li>
              <Typography sx={{ fontSize: 12 }}>
                미술품의 경우 카드사 정책으로 비씨카드 200만원 이상 상품 불가,
                1인당 1회 50만원 제한, 월100만원 제한, 할부 3개월로 제한돼
                있습니다.
              </Typography>
            </li>
            <li>
              <Typography sx={{ fontSize: 12 }}>
                가급적 무통장 결제 이용을 권해드립니다.
              </Typography>
            </li>
          </ul>
          <Button
            size="large"
            variant="contained"
            sx={{
              borderRadius: 12,
              background: 'rgb(14, 12, 39)',
              boxShadow: 'none',
            }}
            disabled={!orderPossible}
            onClick={async () => {
              const paymentMethodKor =
                paymentMethod === 'card'
                  ? '카드'
                  : paymentMethod === 'cash'
                  ? '가상계좌'
                  : '휴대폰';
              await apis.order.update({
                id: order.id,
                delivery: delivery.id,
                price: paymentPrice,
                discountedAmount: 0,
                deliveryPrice: 0,
                paymentMethod: paymentMethodKor,
              });
              const orderItems = order.attributes.order_items.data;

              const ifErrorsInStock = await Promise.all(
                orderItems.map(async (orderItem) => {
                  const { data: product } = await apis.product.get(
                    orderItem.attributes.product.data.id
                  );
                  const productStock = product.attributes.stock;
                  const buyStock = orderItem.attributes.amount;
                  return productStock < buyStock;
                })
              );
              if (ifErrorsInStock.some((o) => o)) {
                alert('재고가 없습니다.');
              } else {
                const productNames = orderItems.map(
                  (orderItem: any) =>
                    orderItem.attributes.product.data.attributes.name
                );
                window.tossPayments
                  .requestPayment(paymentMethodKor, {
                    // 결제 수단 파라미터
                    // 결제 정보 파라미터
                    amount: paymentPrice,
                    orderId: `order-${router.query.id}`,
                    orderName: `${productNames[0]}${
                      productNames.length > 1
                        ? `및 ${productNames.length - 1}건`
                        : ''
                    }`,
                    customerName: user?.nickname,
                    successUrl: `${process.env.NEXT_PUBLIC_HOST}/api/order/success`,
                    failUrl: `${process.env.NEXT_PUBLIC_HOST}/api/order/fail`,
                  })
                  .catch(function (error) {
                    if (error.code === 'USER_CANCEL') {
                      // 결제 고객이 결제창을 닫았을 때 에러 처리
                      alert('유효하지 않은 결제');
                    } else if (error.code === 'INVALID_CARD_COMPANY') {
                      // 유효하지 않은 카드 코드에 대한 에러 처리
                      alert('유효하지 않은 카드');
                    }
                  });
              }
            }}
          >
            결제하기
          </Button>
        </Stack>
      </Box>

      <AddressChanger
        initialValues={delivery}
        open={addressChangerOpen}
        onOpen={() => {
          setAddressChangerOpen(true);
        }}
        onClose={() => {
          setAddressChangerOpen(false);
        }}
        onSubmit={async ({ recipient, mobile: phone, address, memo }) => {
          confirm
            .open({
              title: '저장하시겠습니까?',
              buttons: [{ label: '취소' }, { label: '저장', isDanger: true }],
            })
            .then(async (confirm) => {
              if (confirm === '저장') {
                if (delivery) {
                  await apis.delivery.update({
                    id: delivery.id,
                    recipient,
                    mobile: phone,
                    address,
                    memo,
                  });
                  setAddressChangerOpen(false);
                } else {
                  await apis.delivery.create({
                    user: user?.id,
                    recipient,
                    mobile: phone,
                    address,
                    memo,
                  });
                }
                refetchDeliveries();
                enqueueSnackbar('저장이 완료되었습니다.');
              }
            });
        }}
      />

      <Alert
        open={alertOpen}
        onClose={() => {
          setAlertOpen(false);
        }}
        title="구매확정"
        subTitle={`구매확정 시, 교환 및 반품이 불가하므로\n반드시 작품을 배송 받으신 후 진행해주세요.`}
        buttons={[
          {
            label: '취소',
            onClick: () => {
              setAlertOpen(false);
            },
          },
          {
            label: '완료',
            isDanger: true,
            onClick: () => {
              setAlertOpen(false);
              setAddressChangerOpen(true);
              setIsConfirmed(true);
            },
          },
        ]}
      />
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
