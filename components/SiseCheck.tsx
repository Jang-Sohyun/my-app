import { Typography, Divider } from '@mui/material';
import { Stack, Button, IconButton, Box } from '@mui/material';
import TextInput from 'components/TextInput';
import BottomSheet from 'components/BottomSheet';
import { useEffect, useState } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DaumAddressFinder from 'components/DaumAddressFinder';

const receiverData = {
  name: '최우림',
  phone: '010-2480-1949',
  address: '(04309)서울특벽실 용산구 청파로47나길 32-2 그린빌 307호',
  memo: '집앞에다놔주세요',
};
const SiseCheck = ({ open, onOpen, onClose, product, onSubmit }) => {
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
          <Box component="img" sx={{ width: '100%' }} src="/images/sise.png" />
        </Stack>
      </BottomSheet>
    </>
  );
};

export default SiseCheck;
