import { Typography, Divider } from '@mui/material';
import { Stack, Button, IconButton, Box } from '@mui/material';
import TextInput from '../components/TextInput';
import BottomSheet from '../components/BottomSheet';
import { useEffect, useState } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DaumAddressFinder from '../components/DaumAddressFinder';

const receiverData = {
  name: '최우림',
  phone: '010-2480-1949',
  address: '(04309)서울특벽실 용산구 청파로47나길 32-2 그린빌 307호',
  memo: '집앞에다놔주세요',
};
const AddressChanger = ({ open, onOpen, onClose, product, onSubmit }) => {
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
          <Stack justifyContent="center" alignItems="center">
            <Typography gutterBottom>
              <strong>컬랙팅 카드 정품 등록</strong>
            </Typography>
            <Typography>
              정품 확인서에 동봉된 코드 13자리를 입력해주세요
            </Typography>
          </Stack>
          <Stack sx={{ px: '20px', pb: '5%', pt: '12px' }} spacing={1}>
            <TextInput
              label="코드"
              value={code}
              placeholder="123456789"
              onChange={(e) => {
                setCode(e.target.value.slice(0, 13).trim());
              }}
              sx={{ mb: 2 }}
            />
            <Button
              size="large"
              variant="contained"
              sx={{
                background: 'rgb(14, 12, 39)',
                borderRadius: 12,
                boxShadow: 'none',
              }}
              disabled={!code}
              onClick={() => {
                onSubmit(code);
                setCode('');
              }}
            >
              입력하기
            </Button>
          </Stack>
        </Stack>
      </BottomSheet>
    </>
  );
};

export default AddressChanger;
