import { Typography, Divider } from '@mui/material';
import { Stack, Button, IconButton, Box } from '@mui/material';
import TextInput from 'components/TextInput';
import BottomSheet from 'components/BottomSheet';
import { useEffect, useState } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DaumAddressFinder from 'components/DaumAddressFinder';
import { BANKS } from 'constants/order';

const AddressChanger = ({
  initialValues,
  open,
  onOpen,
  onClose,
  product,
  onSubmit,
}) => {
  const [openDaumAddressFinder, setOpenDaumAddressFinder] = useState(false);
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  useEffect(() => {
    if (open) {
      setBank(initialValues?.attributes.bank || '');
      setAccount(initialValues?.attributes.account || '');
      setName(initialValues?.attributes.name || '');
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
              <strong>환불 계좌 변경</strong>
            </Typography>
            <Button
              variant="contained"
              sx={{ padding: '3px 16px', borderRadius: '14px' }}
              onClick={async () => {
                await onSubmit({ name, bank, account });
                onClose();
              }}
            >
              완료
            </Button>
          </Stack>
          <Divider />
          <Stack sx={{ px: '20px', pb: '20%', pt: '12px' }} spacing={1}>
            <TextInput
              label="은행"
              value={bank}
              placeholder="우리은행"
              onChange={(e) => {
                setBank(e.target.value);
              }}
              select
              selectOptions={BANKS}
            />
            <TextInput
              label="계좌 번호"
              value={account}
              placeholder="1002844654215"
              onChange={(e) => {
                const value = e.target.value
                  .replaceAll('-', '')
                  .replaceAll(/\D/g, '');
                setAccount(value.trim());
              }}
            />
            <TextInput
              label="예금주"
              value={name}
              placeholder="김우림"
              onChange={(e) => {
                const value = e.target.value;
                setName(value.trim());
              }}
            />
            <Typography sx={{ fontSize: 12, whiteSpace: 'pre' }}>
              {`*변경된 환불계좌는 새로운 주문 건 부터 적용됩니다.\n이미 주문하신 건은 기존의 환불계좌로 환불됩니다.`}
            </Typography>
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
