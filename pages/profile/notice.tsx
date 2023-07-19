import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import { Stack, Box, Typography as Text } from '@mui/material';
import { noticeLists } from 'constants/mockData';
import InfiniteScroll from 'react-infinite-scroll-component';
import { apis } from 'apis';
import dayjs from 'dayjs';
import { useMemo } from 'react';

type Props = {
  onClickGoBack: () => void;
};

const Notice = ({ onClickGoBack }: Props) => {
  const { data, fetchNextPage, hasNextPage } = apis.notice.useGetInfiniteList({
    query: {
      sort: ['createdAt:DESC'],
    },
  });
  const items = useMemo(() => {
    const pages = data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [data]);
  return (
    <ScreenBox>
      <BasicAppBar title="공지 사항" />

      {Array.isArray(noticeLists) && noticeLists.length > 0 ? (
        <InfiniteScroll
          dataLength={items?.length || 0} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<h4>로딩 중</h4>}
        >
          {items.map((item, i) => (
            <Stack key={i} sx={styles.noticeBoxContainer}>
              <Text sx={styles.date}>
                {dayjs(item.attributes.createAt).format('YYYY.MM.DD')}
              </Text>
              <Box>
                <Text>{item.attributes.title}</Text>
                <Text sx={styles.noticeDescription}>
                  {item.attributes.description}
                </Text>
              </Box>
            </Stack>
          ))}
        </InfiniteScroll>
      ) : (
        '공지사항이 없습니다.'
      )}
    </ScreenBox>
  );
};

const styles = {
  noticeBoxContainer: {
    width: '100%',
    p: 2,
    borderBottom: '1px solid #ddd',
  },
  date: {
    fontSize: '12px',
    textAlign: 'right',
  },
  noticeDescription: {
    whiteSpace: 'pre-line',
  },
};

export default Notice;
