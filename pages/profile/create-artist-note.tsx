import { Divider, Typography } from '@mui/material';
import {
  Stack,
  Button,
  IconButton,
  Input,
  OutlinedInput,
  Box,
} from '@mui/material';
import ScreenBox from 'components/ScreenBox';
import { useEffect, useState } from 'react';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import ImageUploader from 'components/ImageUploader';
import AttachSaleItems from 'components/AttachSaleItems';
import LinkIcon from '@mui/icons-material/Link';

const data = {
  image: '/images/mock8.jpg',
  name: '아트네임',
  artist: '아티스트',
  price: 30000,
  quantity: 1,
  optionLabel: '원화 | one size',
};
const Create = ({ open, onOpen, onClose, product, onSubmit }) => {
  const [attachSaleItemsOpen, setAttachSaleItemsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  useEffect(() => {
    if (open) {
      setTitle('');
      setBody('');
    }
  }, [open]);
  const [saleItems, setSaleItems] = useState([
    {
      id: '0',
      image: '/images/mock8.png',
      text: '스위밍풀',
    },
    {
      id: '1',
      image: '/images/mock8.png',
      text: '스위밍풀',
    },
    {
      id: '2',
      image: '/images/mock8.png',
      text: '스위밍풀',
    },
  ]);
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
            <strong>작가 노트 작성</strong>
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
          <Typography
            sx={{
              marginLeft: '12px',
              fontSize: 13,
            }}
          >
            제목
          </Typography>
          <OutlinedInput
            sx={{
              borderRadius: 4,
              mb: 2,
            }}
            placeholder="20자 이내 입력해주세요."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <Typography
            sx={{
              marginLeft: '12px',
              fontSize: 13,
              mb: 0.5,
            }}
          >
            내용
          </Typography>
          <Divider />
          <Input
            sx={{
              ':before, :after': {
                borderBottom: '0px !important',
              },
              pt: '24px',
            }}
            placeholder="전시회 및 작품 제작소식 / 개인 공지사항 / 근황 및 소식 등에 팬들에게 알릴 내용을 입력해 주세요."
            multiline
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          <Stack direction="row" alignItems="center">
            <ImageUploader max={10} multiple />
            <IconButton
              onClick={() => {
                setAttachSaleItemsOpen(true);
              }}
            >
              <LinkIcon
                sx={{
                  color: '#A3A3A3',
                }}
              />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <AttachSaleItems
        open={attachSaleItemsOpen}
        onOpen={() => {
          setAttachSaleItemsOpen(true);
        }}
        onClose={() => {
          setAttachSaleItemsOpen(false);
        }}
        items={saleItems}
      />
    </ScreenBox>
  );
};

export default Create;
