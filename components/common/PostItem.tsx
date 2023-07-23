import Text from '@mui/material/Typography';
import {
  Card,
  CardMedia,
  Stack,
  CardContent,
  CardActions,
  Box,
  IconButton,
} from '@mui/material';
import AvatarProfile from '../../components/common/Avatar';
import { LikeIcon } from '../../components/svgIcons';
import { formatCount, formatDescriptionSummary } from '../../libs/utils';
import * as StaticUrls from '../../constants/staticUrls';
import dayjs from 'dayjs';
import { apis } from '../../apis';
import { useDdleContext } from '../../contexts/Ddle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useContext as useConfirm } from '../../contexts/confirm';
import { useContext as useMoreConfirm } from '../../contexts/moreConfirm';
import LinkIcon from '@mui/icons-material/Link';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import share from '../../libs/share';
import Link from 'next/link';
import { LinkIt } from 'react-linkify-it';

const PostItem = ({
  item,
  onClickComment,
  onClickPhoto,
  refetch,
  detailMode,
}: any) => {
  const artist = item.attributes.artist.data;
  const writer = item.attributes.user.data;
  const product = item.attributes.product.data;

  const author = {
    id: writer.id,
    name: writer.attributes.nickname,
    profile: writer.attributes.avatar.data?.attributes.url,
    artist,
  };
  const { enqueueSnackbar } = useSnackbar();

  const [, moreConfirm] = useMoreConfirm();
  const [, confirm] = useConfirm();
  const { user, requestLogin } = useDdleContext();
  const router = useRouter();
  const { isLiked, count: likeCount, like } = apis.likingNote.useLike(item.id);
  const moreMenu = [
    {
      label: '취소',
      isDanger: true,
    },
  ];
  if (user?.id === author.id) {
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
                  pathname: '/community/create',
                  query: {
                    note: item.id,
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
                await apis.artistNote.update({
                  id: item.id,
                  removed: true,
                });
                enqueueSnackbar('삭제가 완료되었습니다.');
                refetch();
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
  const images = item?.attributes.images.data;
  const imageLength = images?.length || 0;
  return (
    <Box sx={styles.timeline}>
      {!detailMode && (
        <AvatarProfile
          avatar={author}
          secondaryText={dayjs(item.attributes.createdAt).fromNow()}
          rightComponent={
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
          }
        />
      )}
      {detailMode ? (
        <Box sx={{ position: 'relative' }}>
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
      ) : null}
      <>
        <Card sx={detailMode ? styles.cardWithNoAvatar : styles.card}>
          <CardContent sx={{ paddingBottom: '12px', px: 3 }}>
            {item.attributes.title ? (
              <Text variant="body1" sx={styles.noteTitle}>
                {item.attributes.title}
              </Text>
            ) : null}
            <Text variant="body1" sx={styles.noteDescription}>
              {detailMode ? (
                <LinkIt
                  component={(match) => {
                    const hostname = 'https://artddle.com';
                    let inhousePath = '';
                    if (match.indexOf(hostname) === 0) {
                      inhousePath = match.replace(hostname, '') || '/';
                    }
                    if (inhousePath) {
                      return (
                        <Link href={inhousePath} style={{ color: '#0000EE' }}>
                          {match}
                        </Link>
                      );
                    }
                    return (
                      <a
                        style={{ color: '#0000EE' }}
                        href={/^www\./.exec(match) ? `https://${match}` : match}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {match}
                      </a>
                    );
                  }}
                  regex={
                    /(https?:\/\/|www\.)([-\w.]+\/[\p{L}\p{Emoji}\p{Emoji_Component}!#$%&'"()*+,./\\:;=_?@[\]~-]*[^\s'",.;:\b)\]}?]|(([\w-]+\.)+[\w-]+[\w/-]))/u
                  }
                >
                  {item.attributes.text}
                </LinkIt>
              ) : (
                <>
                  {formatDescriptionSummary(item.attributes.text, 100)}
                  {item.attributes.text.length > 100 ? (
                    <Link href={`/note/${item.id}`}>
                      <span style={styles.moreDescription}>더보기</span>
                    </Link>
                  ) : null}
                </>
              )}
            </Text>
            {imageLength > 1 ? (
              <Stack direction={'row'} sx={styles.noteThumnail} spacing={0.2}>
                <CardMedia
                  sx={styles.mediaThumnail}
                  component="img"
                  height="auto"
                  image={images?.[0].attributes.url}
                  onClick={() => onClickPhoto(item, 0)}
                />
                <CardMedia
                  sx={styles.mediaThumnail}
                  component="img"
                  height="auto"
                  image={images?.[1].attributes.url}
                  onClick={() => onClickPhoto(item, 1)}
                />

                {imageLength > 2 ? (
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      position: 'absolute',
                      right: '0px',
                      bottom: '0px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      width: '26px',
                      height: '26px',
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 12,
                        color: 'white',
                      }}
                    >
                      +{imageLength - 2}
                    </Text>
                  </Stack>
                ) : null}
              </Stack>
            ) : imageLength === 1 ? (
              <CardMedia
                sx={styles.noteThumnail}
                component="img"
                height="auto"
                image={images?.[0].attributes.url}
                onClick={() => onClickPhoto(item, 0)}
              />
            ) : null}
          </CardContent>

          <CardActions sx={{ paddingTop: 0, ml: 1 }}>
            <Stack direction="column" sx={{ width: '100%' }}>
              {product && (
                <Stack
                  direction="row"
                  sx={{ width: '100%' }}
                  alignItems="center"
                >
                  <Link href={`/product/${product.id}`}>
                    <IconButton disableRipple>
                      <LinkIcon />
                      <Text sx={styles.commentCount}>
                        {product.attributes.name}
                      </Text>
                    </IconButton>
                  </Link>
                </Stack>
              )}
              <Stack direction="row" sx={{ width: '100%' }}>
                <IconButton
                  aria-label="댓글"
                  disableRipple
                  onClick={() => {
                    onClickComment(item);
                  }}
                >
                  <img
                    src={StaticUrls.Icons.Message}
                    style={{ width: '24px' }}
                  />
                  <Text sx={styles.commentCount}>
                    {formatCount(item.attributes.commentCount || 0)}
                  </Text>
                </IconButton>
                <IconButton aria-label="좋아요" disableRipple onClick={like}>
                  <LikeIcon isLiked={isLiked} sx={{ width: '20px' }} />
                  <Text sx={styles.likeCount}>
                    {formatCount(likeCount || 0)}
                  </Text>
                </IconButton>
                <IconButton
                  aria-label="공유"
                  sx={styles.btnShare}
                  disableRipple
                  onClick={() => {
                    share({
                      url: `${window.location.origin}/note/${item.id}`,
                    });
                  }}
                >
                  <img src={StaticUrls.Icons.Share} style={{ width: '24px' }} />
                </IconButton>
              </Stack>
            </Stack>
          </CardActions>
        </Card>
      </>
    </Box>
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
    // maxWidth: 345,
    borderRadius: '8px',
    border: (theme) => `1px solid ${theme.palette.grey[200]}`,
    // boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px',
    marginTop: '10px',
  },
  noteTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginTop: '15px',
    marginBottom: '15px',
    whiteSpace: 'pre-line',
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
    position: 'relative',
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

export default PostItem;
