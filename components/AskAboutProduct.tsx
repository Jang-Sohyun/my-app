import { Typography, Divider } from '@mui/material';
import { Stack, Button, IconButton, Box } from '@mui/material';
import TextInput from '../components/TextInput';
import BottomSheet from '../components/BottomSheet';
import { useEffect, useState } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';

const AskAboutProduct = ({ open, onOpen, onClose, product, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setBody('');
    }
  }, [open]);

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
            <strong>작품 문의</strong>
          </Typography>
          <Button
            variant="contained"
            sx={{ padding: '3px 16px', borderRadius: '14px' }}
            disabled={title === '' || body === ''}
            onClick={() => {
              onSubmit({ title, body });
            }}
          >
            완료
          </Button>
        </Stack>
        <Divider />
        {Boolean(product) && (
          <Stack sx={{ px: '20px', pb: '20%' }} divider={<Divider />}>
            <Typography sx={{ padding: '12px 20px', fontSize: 14 }}>
              {product.attributes.artist.data?.attributes.name}
            </Typography>
            <Stack
              direction="row"
              alignItems="flex-end"
              sx={{ padding: '12px 20px' }}
            >
              <Typography sx={{ fontSize: 14, mr: 1 }}>
                {product.attributes.name}
              </Typography>
              <Typography sx={{ fontSize: 10, mr: 0.5 }}>
                {product.attributes.tags}
                {product.attributes.subDesc ? ', ' : ''}
              </Typography>
              <Typography sx={{ fontSize: 10 }}>
                {product.attributes.subDesc}
              </Typography>
            </Stack>
            <Stack sx={{ pt: 1 }}>
              <Typography sx={{ padding: '12px 20px', fontSize: 14 }}>
                문의 내용
              </Typography>
              <TextInput
                sx={{ mb: '14px' }}
                label=""
                placeholder="제목을 입력하세요. (최대20자)"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <TextInput
                label=""
                placeholder="문의하실 내용을 입력해 주세요."
                multiline
                rows={6}
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

export default AskAboutProduct;
