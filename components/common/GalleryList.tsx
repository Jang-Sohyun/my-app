import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CategorySelect from '../../components/common/CategorySelect';
import Masonry from '@mui/lab/Masonry';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../../components/Loader';
import GalleryItem from './GalleryItem';

type Props = {
  title?: string;
  hasCategoryTab?: boolean;
  showMeta?: boolean;
  tabs?: {
    text: string;
    type?: string;
  }[];
  items: any[];
  onChangeCategory?: (tabIndex: number) => void;
};

export default function GalleryList({
  title,
  items,
  hasCategoryTab = true,
  showMeta = true,
  tabs,
  isLikeable,
  onLike,
  selectedTab,
  onChangeCategory,
  selectMode,
  selectedIdxes,
  onSelect,
  fetchNextPage,
  hasNextPage,
  loading,
}: Props) {
  return (
    <Box sx={styles.gallery}>
      <Typography sx={styles.galleryGuideMsg}>{title}</Typography>

      {hasCategoryTab && (
        <CategorySelect
          selectedTab={selectedTab}
          tabs={tabs}
          onChange={onChangeCategory}
        />
      )}
      {!loading && items?.length === 0 ? (
        <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
          <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
            작성된 게시글이 없습니다.
          </Typography>
        </Stack>
      ) : loading ? (
        <Loader />
      ) : (
        <InfiniteScroll
          dataLength={items?.length || 0} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<Loader />}
          style={{ minHeight: '100vh', overflow: 'hidden' }}
        >
          <Masonry columns={2} spacing={0} sx={{ px: 1 }}>
            {items.map((item) => {
              return (
                <GalleryItem
                  key={item.id}
                  item={item}
                  selectMode={selectMode}
                  onSelect={onSelect}
                  showMeta={showMeta}
                  selectedIdxes={selectedIdxes}
                  isLikeable={isLikeable}
                  onLike={() => {
                    if (onLike) onLike(item);
                  }}
                />
              );
            })}
          </Masonry>
        </InfiniteScroll>
      )}
    </Box>
  );
}

const styles = {
  galleryGuideMsg: {
    fontSize: '20px',
    fontWeight: 'bold',
    mt: 2.5,
    mb: 1,
    mx: 2,
  },
  gallery: {
    width: '100%',
  },
  aditionalInfo: {
    paddingLeft: '10px',
    marginTop: '8px',
    marginBottom: '8px',
    lineHeight: '1.1',
  },
  creator: {
    marginTop: '5px',
    fontWeight: 'bold',
  },
  title: {
    marginTop: '-5px',
  },
};
