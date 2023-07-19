import Text from '@mui/material/Typography';
import {
  Card,
  CardMedia,
  Stack,
  CardContent,
  CardActions,
  Box,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import AvatarProfile from 'components/common/Avatar';
import { Post } from 'types/index';
import { LikeIcon } from 'components/svgIcons';
import { SvgIcon } from '@mui/material';
import { formatCount, formatDescriptionSummary } from 'libs/utils';
import * as StaticUrls from 'constants/staticUrls';

type PostTimeLineItemProps = {
  type: 'post' | 'note';
  showAvatar: boolean;
  post: Post;
  onClickReadMore: () => void;
};

const PostTimeLineItem = ({
  type = 'post',
  showAvatar = true,
  post,
  onClickReadMore,
}: PostTimeLineItemProps) => (
  <Box sx={styles.timeline}>
    {showAvatar && <AvatarProfile avatar={post.author} secondaryText="1분전" />}
    {
      // 노트형 타임라인인 경우 상단에 생성일 표시
      type == 'note' && <Text sx={styles.createAt}>{post.createdAt}</Text>
    }

    <Card sx={showAvatar ? styles.card : styles.cardWithNoAvatar}>
      <CardContent>
        <Text variant="h1" sx={styles.noteTitle}>
          {post.title}
        </Text>
        <Text variant="body1" sx={styles.noteDescription}>
          {
            // 노트형 타임라인인 경우 설명 다 보여주고, 나머지 유형은 내용 자르고 말줄임표 표시
            type == 'note'
              ? post.description
              : formatDescriptionSummary(post.description, 100)
          }
          {
            // 노트형 타임라인이 아닌 경우에만 더보기 표시
            type !== 'note' && (
              <span style={styles.moreDescription} onClick={onClickReadMore}>
                더보기
              </span>
            )
          }
        </Text>
      </CardContent>
      <CardMedia
        sx={styles.noteThumnail}
        component="img"
        height="auto"
        image={post.thumbnail}
        alt={`${post.author.name}'s artwork`}
      />
      <CardActions>
        {/* FIXME : 이미지 리소스 받으면 아이콘 교체해야함 */}
        <IconButton aria-label="댓글" disableRipple>
          <img src={StaticUrls.Icons.Message} style={{ width: '24px' }} />
          <Text sx={styles.commentCount}>{formatCount(post.commentCount)}</Text>
        </IconButton>
        <IconButton aria-label="좋아요" disableRipple>
          <LikeIcon isLiked={false} sx={{ width: '20px' }} />
          <Text sx={styles.likeCount}>{formatCount(post.likeCount)}</Text>
        </IconButton>
        <IconButton aria-label="공유" sx={styles.btnShare} disableRipple>
          <img src={StaticUrls.Icons.Share} style={{ width: '24px' }} />
          {/* <ShareIcon /> */}
        </IconButton>
      </CardActions>
    </Card>
  </Box>
);

type PostTimeLineProps = {
  type: 'post' | 'note';
  showAvatar: boolean;
  posts: Post[];
  onClickReadMore: () => void;
};

const PostTimeLine = ({
  type = 'post',
  showAvatar,
  posts,
  onClickReadMore,
}: PostTimeLineProps) => {
  return (
    <Stack sx={{ width: '90%' }}>
      {posts.map((item) => (
        <PostTimeLineItem
          key={item.id}
          type={type}
          showAvatar={showAvatar}
          post={item}
          onClickReadMore={onClickReadMore}
        />
      ))}
    </Stack>
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
    maxWidth: 345,
    borderRadius: '8px',
    boxShadow: 'rgb(0 0 0 / 12%) 0px 3px 8px',
    // marginLeft: '50px',
    // marginTop: '10px',
  },
  cardWithNoAvatar: {
    // maxWidth: 345,
    borderRadius: 0,
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
  },
  noteThumnail: {
    width: '90%',
    margin: '0 auto',
    borderRadius: '14px',
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

export default PostTimeLine;
