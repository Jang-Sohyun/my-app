import { Typography, Divider } from '@mui/material';
import { Stack, Button, IconButton, Box } from '@mui/material';
import TextInput from '../components/TextInput';
import BottomSheet from '../components/BottomSheet';
import { useEffect, useState } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DaumAddressFinder from '../components/DaumAddressFinder';

const AddressChanger = ({
  initialValues,
  open,
  onOpen,
  onClose,
  product,
  onSubmit,
}) => {
  const [openDaumAddressFinder, setOpenDaumAddressFinder] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [memo, setMemo] = useState('');
  useEffect(() => {
    if (open) {
      setRecipient(initialValues?.attributes.recipient || '');
      setPhone(initialValues?.attributes.mobile || '');
      setAddress(initialValues?.attributes.address || '');
      setMemo(initialValues?.attributes.memo || '');
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
              <strong>배송지 변경</strong>
            </Typography>
            <Button
              variant="contained"
              sx={{ padding: '3px 16px', borderRadius: '14px' }}
              onClick={async () => {
                await onSubmit({ recipient, mobile: phone, address, memo });
                onClose();
              }}
            >
              완료
            </Button>
          </Stack>
          <Divider />
          <Stack sx={{ px: '20px', pb: '20%', pt: '12px' }} spacing={1}>
            <TextInput
              label="받는 분"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
            />
            <TextInput
              label="연락처"
              value={phone}
              onChange={(e) => {
                const value = e.target.value
                  .replaceAll('-', '')
                  .replaceAll(/\D/g, '');
                setPhone(value.trim());
              }}
            />

            <TextInput
              label={
                <>
                  배송 주소
                  <span
                    role="button"
                    style={{ marginLeft: '8px', color: '#007AFF' }}
                    onClick={() => {
                      setOpenDaumAddressFinder(true);
                    }}
                  >
                    우편번호 찾기
                  </span>
                </>
              }
              multiline
              rows={3}
              helperText="상세 주소까지 입력하여주세요."
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <TextInput
              label="배송 메모"
              value={memo}
              placeholder='예) "집 앞에 놓아주세요"'
              onChange={(e) => {
                setMemo(e.target.value);
              }}
            />
          </Stack>
        </Stack>
      </BottomSheet>

      <DaumAddressFinder
        open={openDaumAddressFinder}
        onClose={() => setOpenDaumAddressFinder(false)}
        onSubmit={({ address, addressDetail, zipCode }) => {
          setAddress(`(${zipCode}) ${address} ${addressDetail}`);
        }}
      />
    </>
  );
};

export default AddressChanger;
