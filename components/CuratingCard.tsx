import { Stack, Avatar, Typography, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { apis } from '../apis';
import dayjs from 'dayjs';
import { useDdleContext } from '../contexts/Ddle';
import { useContext as useConfirm } from '../contexts/confirm';
import { useContext as useMoreConfirm } from '../contexts/moreConfirm';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

const CuratingCard = ({ item, sx, onClickImage, ...props }: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const [, moreConfirm] = useMoreConfirm();
  const [, confirm] = useConfirm();
  const { user, requestLogin } = useDdleContext();
  const router = useRouter();
  const moreMenu = [
    {
      label: '취소',
      isDanger: true,
    },
  ];
  if (user?.id === item.attributes.user.data.id) {
    moreMenu.unshift({ label: '삭제하기' });
    moreMenu.unshift({ label: '수정하기' });
  } else {
    moreMenu.unshift({
      label: '신고하기',
    });
  }

  const handleActions = async (text) => {
    try {
      switch (text) {
        case '신고하기': {
          confirm
            .open({
              title: '신고하시겠습니까?',
              buttons: [
                {
                  label: '취소',
                },
                {
                  label: '신고',
                  isDanger: true,
                },
              ],
            })
            .then(async (confirm) => {
              if (confirm === '신고') {
                if (user) {
                  const note = await apis.purchasedReview.get(item.id, {
                    query: {
                      populate: [
                        'user',
                        'order',
                        'order_item',
                        'user.avatar',
                        'artist',
                        'artist.avatar',
                        'images',
                      ],
                      sort: ['createdAt:desc'],
                    },
                  });
                  const reported_by = note?.data?.attributes?.reported_by.data;

                  const idx = reported_by.findIndex((o) => o.id === user.id);
                  if (idx > -1) {
                    enqueueSnackbar('이미 신고하였습니다.');
                  } else {
                    reported_by.push(user);
                    await apis.purchasedReview.update({
                      id: item.id,
                      reported_by,
                    });
                    enqueueSnackbar('신고가 완료되었습니다.');
                  }
                } else {
                  requestLogin();
                }
              }
            });
          break;
        }
        case '수정하기': {
          confirm
            .open({
              title: '수정하시겠습니까?',
              buttons: [
                {
                  label: '취소',
                },
                {
                  label: '수정',
                  isDanger: true,
                },
              ],
            })
            .then(async (confirm) => {
              if (confirm === '수정') {
                router.push({
                  pathname: '/profile/orders/[id]/review',
                  query: {
                    id: item.attributes.order.data.id,
                    'review-id': item.id,
                    'order-item': item.attributes.order_item.data.id,
                  },
                });
              }
            });
          break;
        }
        case '삭제하기': {
          confirm
            .open({
              title: '삭제하시겠습니까?',
              buttons: [
                {
                  label: '취소',
                },
                {
                  label: '삭제',
                  isDanger: true,
                },
              ],
            })
            .then(async (confirm) => {
              if (confirm === '삭제') {
                await apis.purchasedReview.update({
                  id: item.id,
                  removed: true,
                });
                enqueueSnackbar('삭제가 완료되었습니다.');
                window.history.back();
              }
            });
          break;
        }
        case '취소': {
          moreConfirm.close();
          break;
        }
        default:
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Stack
      sx={{
        height: '344px',
        width: '90%',
        backgroundColor: '#fff',
        padding: '20px 18px 35px 18px',
        borderRadius: 4,
        borderTopLeftRadius: 0,
        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        ...sx,
      }}
    >
      <Stack
        direction="row"
        sx={{
          px: '4px',
          mb: '18px',
        }}
      >
        <Avatar
          sx={{ width: '42px', height: '42px' }}
          src={
            item?.attributes.user.data?.attributes.avatar.data?.attributes.url
          }
        />
        <Stack
          sx={{ pl: '10px', width: '100%' }}
          alignItems="center"
          direction="row"
        >
          <Stack sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 13 }}>
              {item.attributes.user.data?.attributes.nickname}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: (theme) => theme.palette.grey[400],
              }}
            >
              구매자 · {dayjs(item.attributes.createdAt).fromNow()}
            </Typography>
          </Stack>
          <IconButton
            onClick={() => {
              moreConfirm
                .open({
                  buttons: moreMenu,
                })
                .then((clicked) => {
                  handleActions(clicked);
                });
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Typography
        sx={{
          fontSize: 15,
          mb: '10px',
          lineHeight: 1.5,
          maxHeight: '64px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {item.attributes.text}
      </Typography>
      {item.attributes.images.data.length > 0 && (
        <Box
          role="button"
          onClick={onClickImage}
          component="img"
          src={item.attributes.images.data[0].attributes.url}
          sx={{
            width: '100%',
            height: '156px',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      )}
    </Stack>
  );
};

export default CuratingCard;
