import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { ShareIcon, MessageIcon, NotiIcon } from '../../components/svgIcons';
import { Stack, IconButton, Box } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import { LikeIcon } from '../../components/svgIcons';
import { ScreenWidth } from '../../constants/styles';
import share from '../../libs/share';

const styles = {
  bottomSnackbar: {
    top: '-38px',
    width: '100%',
    position: 'absolute',
    background: 'rgb(13, 13, 13)',
    color: 'white',
    fontSize: 13,
    py: '9px',
    textAlign: 'center',
  },
  actionButton: {
    background: 'rgb(14,12,39)',
    padding: '12px 50px',
    fontSize: 16,
    borderRadius: 2,
    boxShadow: 'none',
    lineHeight: 1,
    '&:hover, &:active': {
      background: 'rgb(14,12,39)',
    },
  },
};
// FIXME : 하단 공용 메뉴는 특정 Context(로그인 여부/페이지)에 따라 달라질 수 있음. 이 부분 고려해서 추후 수정 해야함
const BottomMenu = ({
  product,
  snackBarOpen,
  onClickCloseSnackbar,
  onClickAsk,
  isSoldOut,
  onClickBuy,
  isLiked,
  onClickLike,
}: any) => {
  return (
    <Paper
      sx={{
        borderRadius: 0,
        position: 'fixed',
        bottom: 0,
        width: '100%',
        maxWidth: ScreenWidth,
        height: '78px',
        // top: `calc(100vh - 78px)`,
      }}
    >
      {isSoldOut && (
        <Box sx={styles.bottomSnackbar}>주문이 종료되었습니다.</Box>
      )}
      {snackBarOpen && (
        <Box sx={styles.bottomSnackbar}>
          세상에 하나뿐인 작품 ! 얼른 소장하세요🔥
          <IconButton
            onClick={onClickCloseSnackbar}
            sx={{ position: 'absolute', right: 0, top: 0 }}
          >
            <CloseRounded sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      )}
      <Stack
        direction="row"
        alignItems="center"
        sx={{ pt: '14px', px: '20px' }}
      >
        {isSoldOut ? (
          <Button
            variant="contained"
            sx={styles.actionButton}
            fullWidth
            disabled
          >
            품절
          </Button>
        ) : (
          <>
            <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
              <IconButton
                onClick={() => {
                  share({
                    url: `${window.location.origin}/product/${product.id}`,
                  });
                }}
              >
                <ShareIcon style={{ stroke: '#000' }} />
              </IconButton>
              <IconButton onClick={onClickLike}>
                <LikeIcon
                  style={{ stroke: isLiked ? 'inherit' : '#000' }}
                  isLiked={isLiked}
                />
              </IconButton>
              <IconButton onClick={onClickAsk}>
                <MessageIcon style={{ stroke: '#000' }} />
              </IconButton>
            </Stack>
            <Button
              variant="contained"
              sx={styles.actionButton}
              onClick={onClickBuy}
            >
              구매하기
            </Button>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default BottomMenu;
