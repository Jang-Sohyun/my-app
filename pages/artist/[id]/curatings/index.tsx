import { useMemo } from 'react';
import BottomMenu from 'components/common/BottomMenu';
import ScreenBox from 'components/ScreenBox';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import BasicAppBar from 'components/common/BasicAppBar';
import InfiniteScroll from 'react-infinite-scroll-component';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import useConfirmDialog from 'libs/useConfirmDialog';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CuratingCard from 'components/CuratingCard';
import { apis } from 'apis/index';
import Alert from 'components/Alert';

const Curatings = () => {
  const router = useRouter();
  const confirmDialog = useConfirmDialog();

  const artistId = router.query.id;

  const result = apis.purchasedReview.useGetInfiniteList(
    {
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
        filters: {
          artist: {
            id: {
              $eq: artistId,
            },
          },
          removed: {
            $ne: true,
          },
        },
      },
    },
    {
      enabled: Boolean(artistId),
    }
  );

  const items = useMemo(() => {
    const pages = result?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [result]);

  return (
    <ScreenBox>
      <BasicAppBar title="3줄 큐레이팅" />

      <Stack
        sx={{
          backgroundColor: '#F7F7F7',
          flex: 1,
          width: '100%',
          height: '100%',
          borderTop: '1px solid rgb(236, 236, 236)',
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          // justifyContent: 'center',
        }}
        spacing={2}
      >
        {items?.length === 0 ? (
          <Stack sx={{ width: '100%', py: 12 }} alignItems="center">
            <Typography sx={{ color: (theme) => theme.palette.grey[400] }}>
              작성된 게시글이 없습니다.
            </Typography>
          </Stack>
        ) : (
          <InfiniteScroll
            dataLength={items?.length || 0} //This is important field to render the next data
            next={result.fetchNextPage}
            hasMore={result.hasNextPage}
            loader={<h4>로딩 중</h4>}
          >
            {items
              ? items.map((item) => (
                  <CuratingCard
                    key={item.id}
                    item={item}
                    sx={{ margin: 'auto', borderTopLeftRadius: '16px', mb: 2 }}
                  />
                ))
              : null}
          </InfiniteScroll>
        )}
      </Stack>
      <Alert
        open={confirmDialog.isOpen}
        onClose={() => {
          confirmDialog.onClose();
        }}
        title={confirmDialog.data?.title}
        subTitle={confirmDialog.data?.body}
        buttons={[
          {
            label: confirmDialog.data?.buttons.cancel,
            onClick: () => {
              confirmDialog.onClose();
            },
          },
          confirmDialog.data?.buttons.confirm
            ? {
                label: confirmDialog.data?.buttons.confirm,
                isDanger: true,
                onClick: () => {
                  confirmDialog.onConfirm(true);
                },
              }
            : null,
        ]}
      />
    </ScreenBox>
  );
};
export default Curatings;
