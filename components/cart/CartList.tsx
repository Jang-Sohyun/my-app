import { Stack, Box, Typography as Text, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Checkbox from '@mui/material/Checkbox';
import ProductListByProvider from '../../components/cart/ProductListByProvider';
import { useMemo } from 'react';

const CartList = ({
  cartItems,
  onSelectAll,
  onSelect,
  selectedIds,
  onRemove,
  onRemoveSelecteds,
}: any) => {
  const cartItemsByArtists = useMemo(() => {
    const returnV: { artist: any; cartItems: any[] }[] = [];
    cartItems.forEach((cart: any) => {
      const artist = cart.attributes.product?.data.attributes.artist.data;
      const prevArtistIdx = returnV.findIndex(
        (item) => item.artist.id === artist.id
      );
      if (prevArtistIdx > -1) {
        returnV[prevArtistIdx].cartItems.push(cart);
      } else {
        returnV.push({
          artist: artist,
          cartItems: [cart],
        });
      }
    });
    return returnV;
  }, [cartItems]);
  return (
    <>
      {/* 상단 전체선택, 작품삭제 버튼*/}
      <Stack
        sx={styles.checkAllContainer}
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          sx={styles.checkAllLabel}
          onClick={() => {
            onSelectAll();
          }}
        >
          <Checkbox
            sx={styles.checkAllCheckbox}
            icon={<CheckCircleOutlineIcon />}
            checkedIcon={<CheckCircleIcon />}
            checked={selectedIds.length === cartItems.length}
          />
          전체선택 ({selectedIds.length}/{cartItems.length})
        </Box>

        <Button
          sx={[
            styles.deleteButton,
            {
              opacity: selectedIds.length > 0 ? 1 : 0.5,
            },
          ]}
          onClick={() => {
            onRemoveSelecteds();
          }}
        >
          작품삭제
        </Button>
      </Stack>

      {/* 판매자 그룹별 장바구니 상품 목록 */}
      {cartItemsByArtists.map(({ artist, cartItems }) => (
        <ProductListByProvider
          key={artist.id}
          shopName={artist.attributes.nickname}
          shopSrc={artist.attributes.avatar.data?.attributes.url}
          cartItems={cartItems}
          onSelect={onSelect}
          selectedIds={selectedIds}
          onRemove={onRemove}
        />
      ))}
    </>
  );
};

const styles = {
  checkAllContainer: { width: '90%', marginTop: '20px' },
  checkAllLabel: {
    mr: 'auto',
    color: '#797979',
    fontWeight: 500,
    fontSize: '14px',
  },
  checkAllCheckbox: { padding: '3px', margin: '10px auto' },
  deleteButton: { ml: 'auto', color: '#797979', fontSize: '12px' },
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

export default CartList;
