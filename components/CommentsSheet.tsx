import { Typography, Avatar } from '@mui/material';
import { Stack, IconButton, Box } from '@mui/material';
import TextInput from '../components/TextInput';
import BottomSheet from '../components/BottomSheet';
import { useEffect, useRef, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import { apis } from '../apis/index';
import dayjs from 'dayjs';
import { useContext as useConfirm } from '../contexts/confirm';
import { useContext as useMoreConfirm } from '../contexts/moreConfirm';
import Close from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import Loader from './Loader';
import { useQueryClient } from 'react-query';
import { useDdleContext } from '../contexts/Ddle';
import Link from 'next/link';
import VerifiedIcon from '@mui/icons-material/Verified';

type CommentProps = {
  depth: number;
  item: any;
  post: any;
  onClickReply: () => void;
  refetch?: () => void;
};
const Comment = (props: CommentProps) => {
  const { user: logginedUser, requestLogin } = useDdleContext();
  const [openedComments, setOpenedComments] = useState(false);
  const { createdAt, text } = props.item.attributes;
  const user = props.item.attributes.user.data;
  const artist = user.attributes.artist?.data;
  const [, moreConfirm] = useMoreConfirm();
  const [, confirm] = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const {
    comments,
    count: commentCount,
    refetch: refetchComments,
  } = apis.artistNoteComment.useComments({
    noteId: props.post.id,
    parent: props.item.id,
    disabledFetch: props.item.attributes.artist_note_comments.data.length === 0,
  });

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
              if (user) {
                if (confirm === '신고') {
                  const comment = await apis.artistNoteComment.get(
                    props.item.id,
                    {
                      query: {
                        populate: '*',
                      },
                    }
                  );
                  const reported_by =
                    comment?.data?.attributes?.reported_by.data;

                  const idx = reported_by.findIndex((o) => o.id === user.id);
                  if (idx > -1) {
                    enqueueSnackbar('이미 신고하였습니다.');
                  } else {
                    reported_by.push(user);
                    await apis.artistNoteComment.update({
                      id: props.item.id,
                      reported_by,
                    });
                    enqueueSnackbar('신고가 완료되었습니다.');
                  }
                }
              } else {
                requestLogin();
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
                await apis.artistNoteComment.update({
                  id: props.item.id,
                  removed: true,
                });
                enqueueSnackbar('삭제가 완료되었습니다.');
                refetchComments();
                props.refetch?.();
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
  const moreMenu = [
    {
      label: '취소',
      isDanger: true,
    },
  ];
  if (logginedUser?.id === user?.id) {
    moreMenu.unshift({ label: '삭제하기' });
  } else {
    moreMenu.unshift({ label: '신고하기' });
  }
  const {
    isLiked,
    count: likeCount,
    like,
  } = apis.likingComment.useLike(props.item.id);

  let removed = props.item.attributes.removed;
  const reported = props.item.attributes.reported_by.data.length > 0;
  if (reported) {
    removed = true;
  }

  const id = artist ? artist.id : user.id;
  const nickname = artist
    ? artist.attributes.nickname
    : user.attributes.nickname;
  const avatarUrl = artist
    ? artist.attributes.avatar.data?.attributes.url
    : user?.attributes.avatar.data?.attributes.url;

  return (
    <>
      <Stack
        direction="row"
        alignItems="flex-start"
        sx={{
          position: 'relative',
          width: '100%',
        }}
      >
        <Link href={artist ? `/artist/${id}` : `/profile/${id}`}>
          <Avatar
            src={removed ? '' : avatarUrl}
            sx={{ width: '40px', height: '40px' }}
          />
        </Link>
        <Stack sx={{ ml: '8px', width: '100%' }} spacing={0.4}>
          <Stack direction="row" spacing={0.7} alignItems="flex-end">
            <Typography sx={{ fontSize: 14, fontWeight: 'bold' }}>
              {removed ? '삭제 됨' : nickname}
            </Typography>

            <Typography
              sx={{ fontSize: 12, color: (theme) => theme.palette.grey[400] }}
            >
              {dayjs(createdAt).fromNow()}
            </Typography>
            {/* 작가 */}
            {artist && (
              <VerifiedIcon
                sx={{
                  width: '16px',
                  height: '16px',
                  color: 'rgb(76, 62, 255)',
                }}
              />
            )}
          </Stack>
          <Typography sx={{ fontSize: 14, pr: 3 }}>
            {removed ? '삭제 됨' : text}
          </Typography>
          {removed ? null : (
            <Stack direction="row" spacing={1}>
              <Typography
                size="small"
                sx={{
                  fontSize: 12,
                  color: (theme) => theme.palette.grey[500],
                  fontWeight: isLiked ? 'bold' : 'regular',
                }}
                role="button"
                onClick={async () => {
                  like();
                }}
              >
                {`좋아요 ${likeCount > 0 ? likeCount : ''}`}
              </Typography>
              {props.depth < 3 && (
                <Typography
                  size="small"
                  sx={{
                    fontSize: 12,
                    color: (theme) => theme.palette.grey[500],
                  }}
                  role="button"
                  onClick={() => {
                    props.onClickReply({
                      id: props.item.id,
                      nickname: nickname,
                      refetch: refetchComments,
                    });
                    setOpenedComments(true);
                  }}
                >
                  답글달기
                </Typography>
              )}
            </Stack>
          )}
          {commentCount > 0 && props.depth >= 1 && !openedComments ? (
            <Typography
              size="small"
              sx={{
                fontSize: 12,
                color: (theme) => theme.palette.grey[500],
              }}
              role="button"
              onClick={() => {
                setOpenedComments(true);
              }}
            >
              답글 {commentCount}개 보기
            </Typography>
          ) : null}
          <Stack sx={{ pt: 1 }}>
            {(props.depth < 1 || (props.depth >= 1 && openedComments)) &&
              comments?.map((comment) => (
                <Comment
                  key={comment.id}
                  post={props.post}
                  depth={props.depth + 1}
                  item={comment}
                  post={props.post}
                  refetch={refetchComments}
                  onClickReply={({ id, nickname, refetch }) => {
                    props.onClickReply({ id, nickname, refetch });
                  }}
                />
              ))}
          </Stack>
        </Stack>

        {removed ? null : (
          <IconButton
            sx={{ position: 'absolute', right: -10, top: -12 }}
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
        )}
      </Stack>
      {props.depth >= 1 &&
        openedComments &&
        props.comments?.map((comment) => (
          <Comment
            post={props.post}
            comments={comment?.comments || []}
            depth={props.depth + 1}
            refetch={refetchComments}
          />
        ))}
    </>
  );
};
const CommentsSheet = ({ open, onOpen, onClose, onSubmit, item, sx }) => {
  const [input, setInput] = useState('');
  const scrollerRef = useRef();
  useEffect(() => {
    if (open) {
      setInput('');
      setTimeout(() => {
        scrollerRef.current?.scrollTo(100, 0);
      }, 100);
    }
  }, [open]);

  const {
    comments,
    create: createComment,
    count: commentCount,
    refetch: refetchComments,
    loading,
  } = apis.artistNoteComment.useComments({ noteId: item.id });

  const [parent, setParent] = useState(null);

  const inputRef = useRef();
  const queryClient = useQueryClient();

  return (
    <>
      <BottomSheet open={open} onOpen={onOpen} onClose={onClose} sx={sx}>
        <Stack sx={{ paddingBottom: 4, pt: 2, height: '100%' }}>
          <Stack
            direction="row"
            alignItems="center"
            sx={{ px: '16px', pb: '10px', py: '24px' }}
          >
            <Typography
              sx={{
                textAlign: 'center',
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              {loading ? null : <strong>{commentCount}개의 댓글</strong>}
            </Typography>
          </Stack>

          <Box
            sx={{
              padding: '14px',
              pb: '100px',
              overflowY: 'auto',
              height: '600px',
              width: '100%',
            }}
            ref={scrollerRef}
          >
            {loading && comments.length === 0 ? (
              <Loader />
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  item={comment}
                  post={item}
                  depth={0}
                  onClickReply={({ id, nickname, refetch }) => {
                    setParent({ id, nickname, refetch });
                    inputRef.current?.focus();
                  }}
                  refetch={refetchComments}
                />
              ))
            ) : (
              <Box
                component="img"
                sx={{ width: '100%' }}
                src="/images/comment-blank.png"
              />
            )}
          </Box>
          <Stack
            sx={{
              position: 'fixed',
              bottom: 0,
              width: '100%',
              py: '12px',
              background: '#fff',
              boxShadow: 'rgb(0 0 0 / 12%) 0px 3px 8px',
            }}
          >
            {parent?.nickname && (
              <Stack direction="row" alignItems="center">
                <Typography
                  sx={{
                    ml: 4,
                    fontSize: 12,
                    color: (theme) => theme.palette.grey[400],
                  }}
                >
                  {parent?.nickname}에게 답글 작성
                </Typography>
                <IconButton
                  disableRipple
                  sx={{
                    width: '10px',
                  }}
                  onClick={() => {
                    setParent(null);
                  }}
                >
                  <Close
                    sx={{
                      width: '10px',
                      height: '10px',
                      color: (theme) => theme.palette.grey[400],
                    }}
                  />
                </IconButton>
              </Stack>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Stack
                sx={{ px: '20px', width: '100%' }}
                spacing={1}
                direction="row"
              >
                <TextInput
                  inputRef={inputRef}
                  containerSx={{
                    width: '100%',
                  }}
                  label=""
                  placeholder="댓글로 작가와 소통해보세요!"
                  value={input}
                  multiline
                  maxRows={3}
                  sx={{
                    width: '100%',
                    background: (theme) => theme.palette.grey[200],
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '0px !important',
                    },
                    flex: 1,
                  }}
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                  size="small"
                />
                <Stack justifyContent="flex-end">
                  <IconButton
                    type="submit"
                    onClick={async () => {
                      if (input) {
                        await createComment({
                          text: input,
                          parent: parent?.id,
                        });
                        setInput('');
                        setParent(null);
                        if (parent?.refetch) {
                          parent.refetch();
                        }
                        refetchComments();
                        queryClient.invalidateQueries();
                        if (!parent) scrollerRef.current?.scrollTo(100, 100000);
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </BottomSheet>
    </>
  );
};

export default CommentsSheet;
