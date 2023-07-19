import {
  Stack,
  Button,
  IconButton,
  Input,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import ScreenBox from 'components/ScreenBox';
import { useEffect, useState } from 'react';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import ImageUploader from 'components/ImageUploader';

const placeholder = `상세한 작품 정보를 입력해주세요.
영감받은 작가/제작과정/작품상세 사진 및 영상/포장 및 증정품 등 관련 내용을 자세히 작성해주세요.`;
const Create = ({ open, onOpen, onClose, product, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  useEffect(() => {
    if (open) {
      setTitle('');
      setBody('');
    }
  }, [open]);

  return (
    <ScreenBox>
      <Stack sx={{ paddingBottom: 4, pt: 2, width: '100%' }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ px: '16px', pb: '10px' }}
        >
          <Box sx={{ flex: 1, zIndex: 1 }}>
            <IconButton onClick={() => window.history.back()}>
              <ArrowLeft />
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
            <strong>작성 수정</strong>
          </Typography>
          <Button
            variant="contained"
            sx={{ padding: '3px 16px', borderRadius: '14px' }}
            disabled={body === ''}
            onClick={() => {
              onSubmit({ title, body });
            }}
          >
            완료
          </Button>
        </Stack>

        <Stack
          sx={{
            px: '24px',
            py: '20px',
          }}
        >
          <Typography sx={{ mb: '10px' }}>스위밍풀</Typography>
          <Divider />
          <Input
            sx={{
              mt: '16px',
              ':before, :after': {
                borderBottom: '0px !important',
              },
            }}
            placeholder={placeholder}
            multiline
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          <ImageUploader max={10} multiple />
        </Stack>
      </Stack>
    </ScreenBox>
  );
};

export default Create;
