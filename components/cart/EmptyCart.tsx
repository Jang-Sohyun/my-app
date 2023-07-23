import { Stack, Typography as Text, Button } from '@mui/material';
import * as newStaticUrls from '../../constants/staticUrls';
import Image from '../../components/Image';

// 알림 메시지가 하나도 없을 때 안내 메시지 표시 컴포넌트
type EmptyCartProps = {
  onClickGotoArtWork: () => void;
};

const EmptyCart = ({ onClickGotoArtWork }: EmptyCartProps) => (
  <Stack
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={1}
    height="70vh"
  >
    <Image
      objectFit="cover"
      width="60px"
      height="60px"
      src={newStaticUrls.Background.CartEmptyBackground}
      alt="Empty Cart"
    />
    <Text sx={styles.noMessageText}>장바구니에 담긴 작품이 없어요</Text>
    <Text sx={styles.noMessageSubText}>작가님의 작품을 담아보세요!</Text>

    <Button
      sx={styles.goToArtworkButton}
      onClick={() => {
        onClickGotoArtWork();
      }}
      variant="contained"
    >
      작품 보러 가기
    </Button>
  </Stack>
);

const styles = {
  noMessageText: {
    color: '#c3c3c3',
    fontWeight: 600,
    marginTop: '15px !important',
  },
  noMessageSubText: {
    fontSize: '14px',
    marginTop: '2px !important',
    fontWeight: 600,
  },
  goToArtworkButton: {
    background: '#000',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '30px',
    width: '150px',
    marginTop: '30px !important',
    fontSize: '15px',
  },
};
export default EmptyCart;
