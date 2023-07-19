import Box from '@mui/material/Box';
import { BottomBarHeight } from 'constants/styles';
import theme from 'constants/theme';
import { SxProps, toArray } from 'libs/sx';
import { Divider, NoSsr, Stack, Typography } from '@mui/material';
import Loader from './Loader';

type Props = {
  sx?: SxProps;
  children?: React.ReactNode;
  noSsr?: boolean;
  noBottomBar?: boolean;
  footer?: boolean;
};
const ScreenBox = (props: Props) => {
  if (props.noSsr)
    return (
      <NoSsr>
        <Box
          sx={[
            styles.root,
            {
              paddingBottom: props.noBottomBar
                ? 'inherit'
                : `${BottomBarHeight}px`,
            },
            ...toArray(props.sx),
          ]}
        >
          {props.children}
        </Box>
        {props.footer ? <Footer /> : null}
      </NoSsr>
    );
  return (
    <>
      <Box
        sx={[
          styles.root,
          {
            paddingBottom: props.noBottomBar
              ? 'inherit'
              : `${BottomBarHeight}px`,
          },
          ...toArray(props.sx),
        ]}
      >
        {props.children}
      </Box>
      {props.footer ? <Footer /> : null}
    </>
  );
};

const Footer = () => (
  <Stack
    sx={{
      py: 6,
      px: 4,
      pb: 10,
      background: (theme) => theme.palette.grey[100],
      color: '#bebebe',
    }}
  >
    <Typography sx={{ fontSize: 14, fontWeight: 'regular' }}>
      ddle뜰 사업자 정보
    </Typography>
    <Stack sx={{ fontSize: 12, py: 2.2 }}>
      <Typography sx={{ fontSize: 12 }}>대표 최우림</Typography>
      <Typography sx={{ fontSize: 12 }}>
        주소 서울시 용산구 서빙고로17 해링턴스퀘어 공공시설동 4층
      </Typography>
      <Typography sx={{ fontSize: 12 }}>문의 070-2480-1949</Typography>
      <Typography sx={{ fontSize: 12 }}>이메일 help@artddle.com</Typography>
      <Typography sx={{ fontSize: 12 }}>사업자등록번호 830-52-00598</Typography>
      <Typography sx={{ fontSize: 12 }}>
        통신판매업신고번호 제2022-서울서대문-001호
      </Typography>
    </Stack>
    <Divider />
    <Stack direction="row" spacing={1.5} sx={{ py: 2.2 }}>
      <Typography
        sx={{ color: '#bebebe', fontSize: 12 }}
        onClick={() => {
          window.location.href = '/images/business.jpg';
        }}
      >
        사업자 정보 조회
      </Typography>
      <Typography
        sx={{ color: '#bebebe', fontSize: 12 }}
        onClick={() => {
          window.location.href =
            'https://buttered-christmas-182.notion.site/f3b1bb27feb64fb1808219b2c9fd1cdf';
        }}
      >
        이용약관
      </Typography>
      <Typography
        sx={{ color: '#bebebe', fontSize: 12 }}
        onClick={() => {
          window.location.href =
            'https://buttered-christmas-182.notion.site/19b1322878774422932f7df98acd63e4';
        }}
      >
        개인정보처리약관
      </Typography>
    </Stack>
    <Typography sx={{ fontSize: 12 }}>
      뜰은 통신판매중개자로서 통신판매 당사자가 아닙니다.
    </Typography>
    <Typography sx={{ fontSize: 12 }}>
      사이트 내에 발생하는 상품에는 관여하지 않으며, 상품 주문, 배송 및 환불의
      의무와 책임은 각 판매 업체에 있습니다.
    </Typography>
    <Typography sx={{ my: 1, fontSize: 12 }}>
      Copyright artddle. All Right Reserved
    </Typography>
  </Stack>
);
const styles = {
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
    borderWidth: { xs: 0, sm: 1 },
    borderStyle: 'solid',
    borderColor: theme.palette.grey['200'],
    background: 'white',
  },
};

export default ScreenBox;
