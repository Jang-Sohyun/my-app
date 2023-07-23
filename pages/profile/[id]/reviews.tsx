import { useState, useEffect, useMemo } from 'react';
import ScreenBox from '../../../components/ScreenBox';
import BottomMenu from '../../../components/common/BottomMenu';
import PostTimeLine from '../../../components/common/PostTimeLine';
import { commuinityCategoryTabs } from '../../../constants/category';
import { initalPosts } from '../../../constants/mockData';
import BasicAppBar from '../../../components/common/BasicAppBar';
import { useRouter } from 'next/router';
import { formatCount, formatDescriptionSummary } from '../../../libs/utils';
import { apis } from '../../../apis';
import { useDdleContext } from '../../../contexts/Ddle';
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
import ReviewItem from '../../../components/ReviewItem';

const Community = () => {
  const [posts, setPosts] = useState(initalPosts);
  const router = useRouter();
  useEffect(() => {
    // TODO : 초기 호출시 선택한 탭 카테고리의 타임라인 목록 조회 API의 응답값을 state에 넣는다.
    // setPosts(API response data)
  }, []);

  // 더보기 클릭시 상세로 이동
  const onClickReadMoreHandler = (id: number) => {
    alert(`더보기 클릭시 해당 노트 상세 화면으로 이동`);
  };

  const result = apis.review.useGetInfiniteList({
    query: {
      populate: ['product', 'product.thumbnails', 'user'],
      sort: ['createdAt:DESC'],
      filters: {
        user: {
          id: {
            $eq: router.query.id,
          },
        },
      },
    },
  });
  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);

  const showAll = false;
  return (
    <ScreenBox>
      <BasicAppBar title="감상평" />

      <Stack sx={{ width: '100%' }} spacing={3}>
        {items.length > 0
          ? items.map((item, i) => <ReviewItem key={item.id} item={item} />)
          : null}
      </Stack>
    </ScreenBox>
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
