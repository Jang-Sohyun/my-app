import { Typography, Divider } from '@mui/material';
import { Stack, Button, IconButton, Box } from '@mui/material';
import TextInput from '../components/TextInput';
import BottomSheet from '../components/BottomSheet';
import { useEffect, useState } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';

const ArtistEnrollder = ({ open, onOpen, onClose, onSubmit }) => {
  const [code, setCode] = useState('');
  useEffect(() => {
    if (open) {
      setCode('');
    }
  }, [open]);

  return (
    <>
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
              <strong>작가 신청</strong>
            </Typography>
            <Button
              variant="contained"
              sx={{ padding: '3px 16px', borderRadius: '14px' }}
              onClick={async () => {
                try {
                  await onSubmit({ code });
                  onClose();
                } catch (e) {
                  alert(e.message);
                }
              }}
            >
              완료
            </Button>
          </Stack>
          <Divider />
          <Stack sx={{ px: '20px', pb: '20%', pt: '12px' }} spacing={1}>
            <TextInput
              label="작가 코드"
              value={code}
              placeholder="작가 코드를 입력해주세요."
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
          </Stack>
        </Stack>
      </BottomSheet>
    </>
  );
};

export default ArtistEnrollder;
