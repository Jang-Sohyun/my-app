import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import GalleryList from 'components/common/GalleryList';
import { initialReviews } from 'constants/mockData';
import BottomMenu from 'components/common/BottomMenu';
import { DeleteRounded, CloseRounded, CheckRounded } from '@mui/icons-material';
import { Box, Stack, IconButton } from '@mui/material';
import Alert from 'components/Alert';
import { useState, useMemo } from 'react';
import useConfirmDialog from 'libs/useConfirmDialog';
import { useRouter } from 'next/router';
import { apis } from 'apis/index';
import { useDdleContext } from 'contexts/Ddle';

const Favorite = () => {
  const router = useRouter();
  const [deleteModeOn, setDeleteModeOn] = useState(false);
  const [selectedIdxes, setSelectedIdxes] = useState<number[]>([]);
  const confirmDialog = useConfirmDialog();
  const reviews = initialReviews;
  const { user } = useDdleContext();

  const likingResult = apis.likingProduct.useGetInfiniteList(
    {
      query: {
        populate: [
          'product',
          'product.images',
          'product.artist',
          'product.thumbnails',
        ],
        sort: ['createdAt:DESC'],
        filters: {
          user: {
            id: {
              $eq: user?.id,
            },
          },
        },
      },
    },
    { enabled: Boolean(user) }
  );
  const likes = useMemo(() => {
    const pages = likingResult?.data?.pages;
    if (pages) return pages.reduce((acc, val) => [...acc, ...val.data], []);

    return [];
  }, [likingResult]);
  const products = likes
    ? likes?.map(({ attributes: { product } }) => product.data)
    : [];
  return (
    <ScreenBox>
      <BasicAppBar title="찜한 작품" />

      {products.length > 0 ? (
        <GalleryList
          items={products}
          hasCategoryTab={false}
          isLikeable
          showMeta
          // selectMode={deleteModeOn}
          // selectedIdxes={selectedIdxes}
          // onSelect={(index) => {
          //   setSelectedIdxes((prev) => {
          //     const next = [...prev];
          //     const idx = next.indexOf(index);
          //     if (idx === -1) {
          //       next.push(index);
          //     } else {
          //       next.splice(idx, 1);
          //     }
          //     return next;
          //   });
          // }}
        />
      ) : (
        <Box
          component="img"
          src="/images/jjim.png"
          sx={{ width: '100%', mt: 20 }}
          role="button"
          onClick={() => {
            router.push('/');
          }}
        />
      )}
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

export default Favorite;
