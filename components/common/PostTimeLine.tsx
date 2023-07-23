import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import CommentsSheet from '../../components/CommentsSheet';
import PhotoPopUp from '../../components/PhotoPopUp';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../../components/Loader';
import PostItem from './PostItem';

type PostTimeLineProps = {
  showReadMore?: boolean;
  items: any[];
  fetchNextPage?: () => void;
  hasNextPage?: () => void;
  loading?: boolean;
  refetch?: () => void;
  detailMode?: boolean;
};

const PostTimeLine = ({
  items,
  fetchNextPage,
  hasNextPage,
  loading,
  refetch,
  detailMode,
}: PostTimeLineProps) => {
  const [photoPopUpOpen, setPhotoPopUpOpen] = useState(false);
  const [photoPopUpItem, setPhotoPopUpItem] = useState(false);
  const [photoPopUpInitialIndex, setPhotoPopUpInitialIndex] = useState(0);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [commentSheetItem, setCommentSheetItem] = useState(false);

  return (
    <>
      <Stack sx={{ width: '90%' }}>
        {loading ? (
          <Stack>
            <Loader />
          </Stack>
        ) : items?.length > 0 ? (
          <InfiniteScroll
            dataLength={items?.length || 0} //This is important field to render the next data
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<h4>로딩 중</h4>}
          >
            {items
              ? items.map((item) => (
                  <PostItem
                    key={item.id}
                    item={item}
                    detailMode={detailMode}
                    onClickComment={(item) => {
                      setCommentSheetOpen(true);
                      setCommentSheetItem(item);
                    }}
                    onClickPhoto={(item, idx) => {
                      setPhotoPopUpOpen(true);
                      setPhotoPopUpItem(item);
                      setPhotoPopUpInitialIndex(idx || 0);
                    }}
                    refetch={refetch}
                  />
                ))
              : null}
          </InfiniteScroll>
        ) : (
          <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
            <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
              작성된 게시글이 없습니다.
            </Typography>
          </Stack>
        )}
      </Stack>

      <PhotoPopUp
        open={photoPopUpOpen}
        initialIndex={photoPopUpInitialIndex}
        onClose={() => {
          setPhotoPopUpOpen(false);
        }}
        item={photoPopUpItem}
        onClickComment={(item) => {
          setCommentSheetOpen(true);
          setCommentSheetItem(item);
        }}
      />
      <CommentsSheet
        sx={photoPopUpOpen ? { zIndex: `1400 !important` } : {}}
        open={commentSheetOpen}
        onOpen={() => {
          setCommentSheetOpen(true);
        }}
        onClose={() => {
          setCommentSheetOpen(false);
        }}
        item={commentSheetItem}
      />
    </>
  );
};

export default PostTimeLine;
