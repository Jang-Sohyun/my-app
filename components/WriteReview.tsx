import { Typography, Divider } from '@mui/material';
import { Stack, Button, IconButton, Box } from '@mui/material';
import TextInput from '../components/TextInput';
import BottomSheet from '../components/BottomSheet';
import { useEffect, useState } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { apis } from '../apis';

const data = {
  image: '/images/mock8.jpg',
  name: '아트네임',
  artist: '아티스트',
  price: 30000,
  quantity: 1,
  optionLabel: '원화 | one size',
};
const WriteArtReview = ({
  open,
  onOpen,
  onClose,
  prevId,
  product,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      if (prevId) {
        (async () => {
          const { data: item } = await apis.review.get(prevId, {
            query: {
              populate: ['product', 'product.thumbnails', 'user'],
            },
          });
          if (item) {
            setBody(item?.attributes?.text);
          }
        })();
      } else setBody('');
    }
  }, [open, prevId]);

  return (
    <BottomSheet open={open} onOpen={onOpen} onClose={onClose}>
      <Stack sx={{ paddingBottom: 4, pt: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ px: '16px', pb: '10px' }}
        >
          <Box sx={{ flex: 1, zIndex: 1 }}>
            <IconButton onClick={onClose}>
              <CloseOutlined />
            </IconButton>
          </Box>
          <Typography
            sx={{
              textAlign: 'center',
              position: 'absolute',
              left: 0,
              right: 0,
            }}
          >
            <strong>감상평 남기기</strong>
          </Typography>
          <Button
            variant="contained"
            sx={{ padding: '3px 16px', borderRadius: '14px' }}
            disabled={body === ''}
            onClick={() => {
              onSubmit({ body });
            }}
          >
            완료
          </Button>
        </Stack>
        <Divider />
        {(Boolean(product) || prevId) && (
          <Stack sx={{ px: '20px', pb: '30%' }} divider={<Divider />}>
            {Boolean(product) && (
              <>
                <Typography sx={{ padding: '12px 20px', fontSize: 14 }}>
                  {product.attributes.artist.data?.attributes.nickname}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="flex-end"
                  sx={{ padding: '12px 20px' }}
                >
                  <Typography sx={{ fontSize: 14, mr: 1 }}>
                    {product.attributes.name}
                  </Typography>
                  {product.attributes.tags ? (
                    <Typography sx={{ fontSize: 10, mr: 0.5 }}>
                      {product.attributes.tags}
                      {product.attributes.subDesc ? ',' : ''}
                    </Typography>
                  ) : null}
                  <Typography sx={{ fontSize: 10 }}>
                    {product.attributes.subDesc}
                  </Typography>
                </Stack>
              </>
            )}
            <Stack sx={{ pt: 1 }}>
              <Typography sx={{ padding: '12px 20px', fontSize: 14 }}>
                감상평 내용
              </Typography>

              <TextInput
                label=""
                placeholder={`남길 감상평을 입력해주세요.\n작품의 색감, 붓터치, 이미지를 보며 느낀 감상을 자유롭게 남기면 됩니다.\n*비속어,무분별한 비방 등을 남길시 게시가 제한될 수 있어요.`}
                multiline
                rows={10}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                }}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
    </BottomSheet>
  );
};

export default WriteArtReview;
