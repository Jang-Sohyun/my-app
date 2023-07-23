import { useRouter } from 'next/router';
import ScreenBox from '../components/ScreenBox';
import BottomMenu from '../components/common/BottomMenu';
import BasicAppBar from '../components/common/BasicAppBar';
import { products } from '../constants/mockData';
import Ordering from '../components/cart/Ordering';
import EmptyCart from '../components/cart/EmptyCart';
import CartList from '../components/cart/CartList';
import { useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useDdleContext } from '../contexts/Ddle';
import { useContext as useConfirm } from '../contexts/confirm';
import {
  Stack,
  Box,
  Typography as Text,
  Button,
  Snackbar,
} from '@mui/material';
import comma from '../libs/comma';
import { apis } from '../apis/index';

const Inbox = () => {
  const router = useRouter();

  const { user, cart, removeCart, changeCart } = useDdleContext();
  const [, confirm] = useConfirm();

  // 작품 보러가기 버튼 클릭시 홈 화면으로 이동한다.
  const onClickGotoArtWork = () => {
    router.push('/');
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const paymentPrice = useMemo(
    () =>
      cart.reduce((acc, val) => {
        const price = selectedIds.includes(val.id)
          ? val.attributes.product.data.attributes.price
          : 0;

        return acc + price * val.attributes.amount;
      }, 0),
    [selectedIds, cart]
  );
  return (
    <ScreenBox>
      {/* 상단 메뉴 */}
      <BasicAppBar title="장바구니" />

      {loading ? (
        <Ordering />
      ) : Array.isArray(cart) && cart.length > 0 ? (
        <>
          <CartList
            cartItems={cart}
            selectedIds={selectedIds}
            onSelectAll={() => {
              if (cart.length === selectedIds.length) {
                setSelectedIds([]);
              } else {
                setSelectedIds(cart.map(({ id }) => id));
              }
            }}
            onSelect={(item: any) => {
              const prevIdx = selectedIds.indexOf(item.id);
              if (prevIdx > -1) {
                setSelectedIds((ids) => {
                  const newIds = ids.slice();
                  newIds.splice(prevIdx, 1);
                  return newIds;
                });
              } else {
                setSelectedIds((ids) => [...ids, item.id]);
              }
            }}
            onRemove={async (item: any) => {
              await removeCart({ cartId: item.id });
              enqueueSnackbar('선택하신 작품이 삭제되었습니다.');
            }}
            onRemoveSelecteds={async () => {
              await Promise.all(
                selectedIds.map((id) => removeCart({ cartId: id }))
              );
              enqueueSnackbar('선택하신 작품이 삭제되었습니다.');
            }}
          />

          {/* 하단 장바구니 금액 총계 표시 및 구매하기 버튼 */}
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={styles.totalContainer}
          >
            <Stack direction="column" sx={styles.totalPriceContainer}>
              <Text sx={styles.totalPriceLabel}>
                총결제금액({selectedIds.length})
              </Text>
              <Text sx={styles.totalPrice}>{comma(paymentPrice)}원</Text>
            </Stack>

            <Button
              variant="contained"
              sx={styles.buyButton}
              disabled={selectedIds.length === 0}
              onClick={() => {
                confirm
                  .open({
                    title: '구매하시겠습니까?',
                    buttons: [
                      { label: '취소' },
                      { label: '구매', isDanger: true },
                    ],
                  })
                  .then(async (confirm) => {
                    if (confirm === '구매') {
                      if (user) {
                        setLoading(true);
                        const orderItems = cart.filter((item) =>
                          selectedIds.includes(item.id)
                        );
                        try {
                          const { data: order } = await apis.order.create({
                            user: user.id,
                          });
                          await Promise.all(
                            orderItems.map((item) =>
                              apis.orderItems.create({
                                product: item.attributes.product.data.id,
                                amount: item.attributes.amount,
                                order: order.id,
                              })
                            )
                          );
                          await Promise.all(
                            selectedIds.map((id) =>
                              removeCart({ cartId: Number(id) })
                            )
                          );
                          router.push(`/order/${order.id}`);
                        } catch (e) {
                          setLoading(false);
                          alert(e.message);
                        }
                      } else {
                        router.push('/login');
                      }
                    }
                  });
                // if (user) {
                //   try {
                //     const { data: order } = await apis.order.create({
                //       user: user.id,
                //     });
                //     const item = {
                //       product: product.id,
                //       amount: quantityWhenNoOptions,
                //       order: order.id,
                //     };
                //     await apis.orderItems.create(item);
                //     router.push(`/order/${order.id}`);
                //   } catch (e) {
                //     alert(e.message);
                //   }
                // } else {
                //   router.push('/login');
                // }
              }}
            >
              구매하기
            </Button>
          </Stack>
        </>
      ) : (
        <EmptyCart onClickGotoArtWork={onClickGotoArtWork} />
      )}
    </ScreenBox>
  );
};

const styles = {
  totalContainer: { width: '88%', mt: 3 },
  totalPriceContainer: { mr: 'auto' },
  totalPriceLabel: { color: '#797979', fontSize: 14 },
  totalPrice: { color: '#444', fontSize: 16, fontWeight: 700 },
  buyButton: {
    ml: 'auto',
    backgroundColor: 'black',
    color: '#fff',
    fontSize: 18,
    width: '140px',
    fontWeight: 700,
    borderRadius: '10px',
  },
};

export default Inbox;
