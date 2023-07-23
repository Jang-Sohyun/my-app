import { Typography, Divider } from '@mui/material';
import ScreenBox from '../../../../components/ScreenBox';
import BasicAppBar from '../../../../components/common/BasicAppBar';
import OrderItem from '../../../../components/OrderItem';
import { Stack, Button, OutlinedInput, Input, Box, Link } from '@mui/material';
import { KeyboardArrowDownOutlined } from '@mui/icons-material';
import TextInput from '../../../../components/TextInput';
import BottomSheet from '../../../../components/BottomSheet';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useDdleContext } from '../../../../contexts/Ddle';
import { apis } from '../../../../apis';
import { useSnackbar } from 'notistack';
import { useContext as useConfirm } from '../../../../contexts/confirm';
import OrderList from '../../../../components/OrderList';
import { useRouter } from 'next/router';

const Cancel = ({ order }: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useDdleContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState(false);
  const [reason, setReason] = useState('');
  const [detailedReason, setDetailedReason] = useState('');
  return (
    <ScreenBox>
      <BasicAppBar title="주문 취소" />
      <Box sx={{ px: '20px', width: '100%' }}>
        <Typography
          sx={{
            fontSize: 13,
            color: (theme) => theme.palette.grey[500],
            textAlign: 'center',
          }}
        >
          상품 준비 중에는 배송상태에 따라 승인 되지 않을 수 있습니다.
        </Typography>
        <Divider sx={{ my: '15px' }} />

        <OrderList items={order.attributes.order_items.data} />
        <Divider sx={{ my: '15px' }} />
        <Stack spacing={1.5}>
          <TextInput
            label="취소 사유"
            placeholder="사유를 선택해주세요."
            endAdornment={<KeyboardArrowDownOutlined />}
            disabled
            sx={{
              '& .MuiOutlinedInput-input.Mui-disabled': {
                WebkitTextFillColor: '#000',
                color: '#000',
              },
            }}
            onClick={() => {
              setDrawerOpen(true);
            }}
            value={reason}
          />

          <TextInput
            label="취소 사유"
            placeholder="상세 사유를 입력해주세요."
            multiline
            rows={6}
            value={detailedReason}
            onChange={(e) => {
              setDetailedReason(e.target.value);
            }}
          />
        </Stack>
      </Box>
      <Stack
        spacing={1}
        sx={{
          mt: '35px',
          pt: '24px',
          pb: '24px',
          px: '20px',
          background: (theme) => theme.palette.grey[100],
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            color: (theme) => theme.palette.grey[400],
          }}
        >
          신용/체크카드, 간편결제(토스,네이버페이,카카오페이,페이코), 휴대폰
          결제로 결제하신 경우, 환불은 결제 취소로 처리됩니다. (휴대폰 결제는
          전체 취소시만 해당)
        </Typography>
        <Typography
          sx={{
            fontSize: 13,
            color: (theme) => theme.palette.grey[400],
          }}
        >
          취소 접수 시, 취소 접수 다음날 (영업일 기준)까지 환불이 완료되며, 환불
          완료시에는 푸시 알림으로 알려 드립니다. (은행, 카드사 사정 에 따라
          최종 환불 처리는 환불 완료 이후 2~3일 정도 소요될 수 있 습니다.)
        </Typography>
      </Stack>
      <Box sx={{ mt: '14px', width: '100%', px: '20px' }}>
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
          disabled={loading}
          onClick={async () => {
            if (user) {
              try {
                setLoading(true);
                await apis.orderCanceled.create({
                  order: order.id,
                  reason,
                  detailedReason,
                  user: user.id,
                });
                await apis.order.update({
                  id: order.id,
                  isCancelled: true,
                });
                router.replace('/');
                enqueueSnackbar('주문이 취소되었습니다.');
              } catch (e) {
                alert(e.message);
              } finally {
                setLoading(false);
              }
            }
          }}
        >
          취소 접수
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
        <Stack sx={{ paddingBottom: 4, pt: 2 }}>
          <Typography
            sx={{
              textAlign: 'center',
              color: (theme) => theme.palette.grey[500],
            }}
          >
            취소 사유를 선택해주세요.
          </Typography>
          <List>
            {[
              {
                text: '주문을 잘못했어요.',
              },
              {
                text: '배송이 지연되었어요.',
              },
              {
                text: '서비스가 불만족스러워요.',
              },
              {
                text: '색상 및 사이즈를 변경하고 싶어요.',
              },
            ].map(({ text }, index, arr) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  py: 1,
                  borderBottom:
                    index < arr.length - 1 ? '1px solid #efefef' : undefined,
                }}
              >
                <ListItemButton
                  sx={{ textAlign: 'center' }}
                  onClick={() => {
                    setReason(text);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
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
          'order_items',
          'order_items.product',
          'order_items.product.artist',
          'order_items.product.thumbnails',
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
export default Cancel;
