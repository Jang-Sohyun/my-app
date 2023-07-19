import { Typography, Divider } from '@mui/material';
import { Stack, Button, IconButton, Box, Avatar } from '@mui/material';
import TextInput from 'components/TextInput';
import BottomSheet from 'components/BottomSheet';
import { useEffect, useState } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ImgInput from './ImgInput';
import { apis } from 'apis/index';

const AccountChanger = ({
  initialValues,
  open,
  onOpen,
  onClose,
  product,
  onSubmit,
}) => {
  const [avatar, setAvatar] = useState({ id: null, url: '' });
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (open) {
      setAvatar(initialValues?.avatar || { id: null, url: '' });
      setNickname(initialValues?.nickname || '');
      setPhone(initialValues?.phone || '');
      setEmail(initialValues?.email || '');
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
              <strong>계정 정보 변경</strong>
            </Typography>
            <Button
              variant="contained"
              sx={{ padding: '3px 16px', borderRadius: '14px' }}
              onClick={() => {
                // onClose();
                onSubmit({ avatar, nickname });
              }}
            >
              완료
            </Button>
          </Stack>
          <Divider />
          <Stack sx={{ px: '20px', pb: '20%', pt: '12px' }} spacing={1}>
            <Stack alignItems="center">
              <IconButton component="label">
                <ImgInput
                  type="file"
                  onUpload={async (file) => {
                    const r = await apis.upload(file);
                    setAvatar({
                      id: r.id,
                      url: r.url,
                    });
                  }}
                />
                <Avatar
                  sx={{ width: '64px', height: '64px' }}
                  src={avatar.url}
                />
              </IconButton>
            </Stack>
            <TextInput
              label="이름"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value.trim().slice(0, 10));
              }}
            />
            <TextInput
              disabled
              label="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.trim());
              }}
            />
            <TextInput
              disabled
              label="연락처"
              value={phone}
              onChange={(e) => {
                const value = e.target.value
                  .replaceAll('-', '')
                  .replaceAll(/\D/g, '');
                setPhone(value.trim());
              }}
            />
          </Stack>
        </Stack>
      </BottomSheet>
    </>
  );
};

export default AccountChanger;
