import { useMemo, useState } from 'react';
import BottomMenu from '../../../../components/common/BottomMenu';
import ScreenBox from '../../../../components/ScreenBox';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import BasicAppBar from '../../../../components/common/BasicAppBar';
import InfiniteScroll from 'react-infinite-scroll-component';
import useConfirmDialog from '../../../../libs/useConfirmDialog';
import CuratingCard from '../../../../components/CuratingCard';
import { apis } from '../../../../apis/index';
import Alert from '../../../../components/Alert';
import ImagesPopUp from '../../../../components/ImagesPopUp';

const Curatings = () => {
  const router = useRouter();
  const confirmDialog = useConfirmDialog();

  const artistId = router.query.id;
  const curatingid = router.query.curatingid;

  const { data: result } = apis.purchasedReview.useGet(
    curatingid,
    {
      query: {
        populate: [
          'order',
          'order_item',
          'user',
          'user.avatar',
          'artist',
          'artist.avatar',
          'images',
        ],
        sort: ['createdAt:desc'],
        filters: {
          removed: {
            $ne: true,
          },
        },
      },
    },
    { enabled: Boolean(curatingid) }
  );

  const [imagePopUpOpen, setImagePopUpOpen] = useState(false);
  if (!result) return null;

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
        <CuratingCard
          item={result.data}
          onClickImage={() => {
            setImagePopUpOpen(true);
          }}
          sx={{ mx: 'auto', borderTopLeftRadius: '16px', mb: 2 }}
        />
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
      <ImagesPopUp
        open={imagePopUpOpen}
        onClose={() => {
          setImagePopUpOpen(false);
        }}
        items={result.data?.attributes.images.data?.map(
          (item) => item.attributes.url
        )}
      />
    </ScreenBox>
  );
};
export default Curatings;
