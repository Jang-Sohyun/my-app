import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { formatDescriptionSummary } from '../libs/utils';
import { apis } from '../apis';
import { useDdleContext } from '../contexts/Ddle';
import WriteReview from '../components/WriteReview';
import Link from 'next/link';
import {
  Stack,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography as Text,
  IconButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import dayjs from 'dayjs';
import { useContext as useConfirm } from '../contexts/confirm';
import { useContext as useMoreConfirm } from '../contexts/moreConfirm';
import { useSnackbar } from 'notistack';

const Community = ({ item, showDetail }) => {
  const router = useRouter();
  const { user } = useDdleContext();

  const author = item.attributes.user.data;

  const moreMenu = [
    {
      label: '취소',
      isDanger: true,
    },
  ];
  if (user?.id === author?.id) {
    moreMenu.unshift({ label: '삭제하기' });
    moreMenu.unshift({ label: '수정하기' });
  } else {
    moreMenu.unshift({
      label: '신고하기',
    });
  }
  const { mutateAsync: updateReview, loading: updateReviewLoading } =
    apis.review.useUpdate();
  const [, moreConfirm] = useMoreConfirm();
  const [, confirm] = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    // TODO : 초기 호출시 선택한 탭 카테고리의 타임라인 목록 조회 API의 응답값을 state에 넣는다.
    // setPosts(API response data)
  }, []);

  // 더보기 클릭시 상세로 이동

  const [updateOpen, setUpdateOpen] = useState(false);
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
                const note = await apis.artistNote.get(item.id, {
                  query: {
                    populate: '*',
                  },
                });
                const reported_by = note?.data?.attributes?.reported_by.data;

                const idx = reported_by.findIndex((o) => o.id === user.id);
                if (idx > -1) {
                  enqueueSnackbar('이미 신고하였습니다.');
                } else {
                  reported_by.push(user);
                  await apis.artistNote.update({
                    id: item.id,
                    reported_by,
                  });
                  enqueueSnackbar('신고가 완료되었습니다.');
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
                setUpdateOpen(true);
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
                await apis.artistNote.update({
                  id: item.id,
                  removed: true,
                });
                enqueueSnackbar('삭제가 완료되었습니다.');
                result.refetch();
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
    <>
      <Stack sx={{ px: 2, width: '100%' }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Text sx={styles.createAt}>
            {dayjs(item.attributes.createdAt).format('YYYY. MM. DD')}
          </Text>
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
            sx={{ position: 'absolute', right: 0, top: '-10px' }}
          >
            <MoreVertIcon sx={{ width: '18px' }} />
          </IconButton>
        </Box>
        <Card
          sx={[
            { width: '100%' },
            false && showAvatar ? styles.card : styles.cardWithNoAvatar,
          ]}
        >
          <CardMedia
            component="img"
            height="auto"
            sx={{ width: '100%' }}
            image={
              item.attributes.product.data.attributes.thumbnails.data[0]
                .attributes.url
            }
          />
          <CardContent>
            <Text variant="body1" sx={styles.noteDescription}>
              {/* {item.attributes.text} */}
              {showDetail
                ? item.attributes.text
                : formatDescriptionSummary(item.attributes.text, 100)}
              {!showDetail && item.attributes.text.length > 100 ? (
                <Link href={`/reviews/${item.id}`}>
                  <span style={styles.moreDescription}>더보기</span>
                </Link>
              ) : null}
            </Text>
          </CardContent>
        </Card>
      </Stack>
      <WriteReview
        // open
        open={updateOpen}
        onClose={() => {
          setUpdateOpen(false);
        }}
        onOpen={() => {
          setUpdateOpen(true);
        }}
        prevId={item.id}
        // product={data}
        onSubmit={({ body }) => {
          if (body.length < 30) {
            confirm.open({
              title: '30자 이상 작성해주세요!',
              body: `감상평은 30자 이상 1000자이하로\n작성할 수 있습니다.`,
              buttons: [
                {
                  label: '확인',
                },
              ],
            });
          } else {
            confirm
              .open({
                title: '감상평을 수정하시겠습니까?',
                body: ``,
                buttons: [
                  {
                    label: '아니오',
                  },
                  {
                    label: '네',
                    isDanger: true,
                  },
                ],
              })

              .then(async (confirm) => {
                if (confirm === '네') {
                  try {
                    await updateReview({
                      id: item.id,
                      text: body,
                    });
                    enqueueSnackbar('감상평이 수정되었습니다.');
                    setUpdateOpen(false);
                    result.refetch();
                  } catch (e) {
                    alert(e.message);
                  }
                }
              });
          }
        }}
      />
    </>
  );
};
const styles = {
  timeline: {
    textAlign: 'left',
    marginBottom: '50px',
  },
  createAt: {
    fontSize: '13px',
    textAlign: 'center',
    color: '#bbb',
  },
  card: {
    // maxWidth: 345,
    borderRadius: '8px',
    boxShadow: 'none',
    border: (theme) => `1px solid ${theme.palette.grey[200]}`,
    marginLeft: '50px',
    mt: 1,
    // marginTop: '10px',
  },
  cardWithNoAvatar: {
    borderRadius: '8px',
    boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px',
    marginTop: '10px',
  },
  noteTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginTop: '15px',
    marginBottom: '15px',
  },
  noteDescription: {
    color: '#444',
    fontSize: 14,
    whiteSpace: 'pre-line',
  },
  noteThumnail: {
    borderRadius: '10px',
    marginTop: '12px',
    overflow: 'hidden',
  },
  mediaThumnail: {
    width: '50%',
  },
  moreDescription: {
    fontWeight: 700,
  },
  commentCount: {
    paddingLeft: '6px',
    fontSize: '13px',
  },
  likeCount: {
    paddingLeft: '6px',
    fontSize: '13px',
  },
  btnShare: {
    marginLeft: 'auto !important',
  },
};

export default Community;
