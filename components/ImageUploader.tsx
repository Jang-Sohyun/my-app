import { Box, Stack, IconButton, ButtonBase, Typography } from '@mui/material';
import Alert from 'components/Alert';
import useConfirmDialog from 'libs/useConfirmDialog';
import { PhotoIcon } from 'components/svgIcons';
import { AddRounded, CancelRounded } from '@mui/icons-material';
import ImgInput, { ImageInputType } from './ImgInput';

export interface ImageInput {
  id?: number;
  url: string;
}
const ImageUploader = ({
  type = '1',
  images,
  onChange,
  imageInputType = 'raw',
  multiple = false,
  max = 1,
}: {
  type: string;
  images?: ImageInput[];
  onChange?: (e: ImageInput[]) => void;
  imageInputType?: ImageInputType;
  multiple?: boolean;
  max?: number;
}) => {
  const confirmDialog = useConfirmDialog();

  if (!images || !onChange) {
    return <h1>잘못된 props. ImageInput</h1>;
  }
  return (
    <Box sx={{ py: 1 }}>
      {type === '2' || images.length > 0 ? (
        <Box
          sx={{
            position: 'relative',
            maxWidth: '100%',
            height: '120px',
            left: 0,
            overflowX: 'auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ position: 'absolute' }}>
            {images.length < max && type === '2' ? (
              <IconButton
                component="label"
                sx={{
                  background: (theme) => theme.palette.grey[200],
                  borderRadius: 0,
                  ':active, :hover': {
                    background: (theme) => theme.palette.grey[200],
                  },
                  width: '62px',
                  height: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                }}
              >
                <AddRounded />
                <ImgInput
                  type={imageInputType}
                  onUpload={(result) => {
                    const next = multiple
                      ? [...images, ...result]
                      : [...images, result];
                    onChange(next.slice(0, max));
                  }}
                  multiple={multiple}
                />

                <Typography sx={{ fontSize: '11px' }}>
                  {images.length}/{max}
                </Typography>
              </IconButton>
            ) : null}
            {images.map((image, i) => (
              <ButtonBase
                key={image.url}
                sx={{
                  width: '62px',
                  height: '80px',
                  // overflow: 'hidden',
                  border: (theme) => `1px solid ${theme.palette.grey[200]}`,
                  borderRadius: 2,
                  position: 'relative',
                }}
                onClick={() => {
                  confirmDialog
                    .open({
                      title: '',
                      body: '이미지를 제거하시겠습니까?',
                      buttons: {
                        cancel: '취소',
                        confirm: '확인',
                      },
                    })
                    .then((result) => {
                      if (result) {
                        onChange((imgs: any) => {
                          const newImgs = [...imgs];
                          newImgs.splice(i, 1);
                          return newImgs;
                        });
                      }
                    });
                }}
              >
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    background: (theme) => theme.palette.grey[200],
                  }}
                  src={image.url}
                />
                <CancelRounded
                  sx={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                  }}
                />
              </ButtonBase>
            ))}
          </Stack>
        </Box>
      ) : null}

      {type === '1' && images.length < max && (
        <Stack direction="row">
          <IconButton component="label">
            <PhotoIcon />
            <ImgInput
              type={imageInputType}
              onUpload={(result) => {
                const next = multiple
                  ? [...images, ...result]
                  : [...images, result];
                onChange(next.slice(0, max));
              }}
            />
          </IconButton>
        </Stack>
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
          {
            label: confirmDialog.data?.buttons.confirm,
            isDanger: true,
            onClick: () => {
              confirmDialog.onConfirm(true);
            },
          },
        ]}
      />
    </Box>
  );
};
export default ImageUploader;
