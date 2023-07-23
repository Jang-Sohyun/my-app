import { Typography } from '@mui/material';
import {
  Stack,
  Button,
  IconButton,
  Input,
  Box,
  OutlinedInput,
  Divider,
} from '@mui/material';
import ScreenBox from '../../components/ScreenBox';
import { useEffect, useState } from 'react';
import ArrowLeft from '@mui/icons-material/ArrowBack';
import ImageUploader, { ImageInput } from '../../components/ImageUploader';
import { useContext as useConfirm } from '../../contexts/confirm';
import { apis } from '../../apis';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useDdleContext } from '../../contexts/Ddle';
import AttachSaleItems from '../../components/AttachSaleItems';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';

const Create = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<ImageInput[]>([]);
  const { user } = useDdleContext();

  const create = apis.artistNote.useCreate();
  const update = apis.artistNote.useUpdate();
  const { enqueueSnackbar } = useSnackbar();
  const [, confirm] = useConfirm();
  const router = useRouter();
  const [attachSaleItemsOpen, setAttachSaleItemsOpen] = useState(false);
  const [attachedItem, setAttachedItem] = useState();

  const prevNoteId = router.query.note;

  useEffect(() => {
    if (prevNoteId) {
      (async () => {
        const note = await apis.artistNote.get(Number(prevNoteId), {
          query: { populate: '*' },
        });
        const { attributes } = note.data;
        setTitle(attributes.title);
        setText(attributes.text);
        if (attributes.images.data) {
          setImages(
            attributes.images.data.map(({ id, attributes }) => ({
              id,
              ...attributes,
            }))
          );
        }
        if (attributes.product.data) {
          const product = attributes.product.data;
          setAttachedItem(product);
        }
      })();
    }
  }, [prevNoteId]);

  const artist = user?.artist;

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
            <strong>노트 작성</strong>
          </Typography>
          <Button
            variant="contained"
            sx={{ padding: '3px 16px', borderRadius: '14px' }}
            disabled={text === '' || create.isLoading}
            onClick={async () => {
              confirm
                .open({
                  title: '작성하시겠습니까?',
                  buttons: [
                    {
                      label: '아니요',
                    },
                    {
                      label: '네',
                      isDanger: true,
                    },
                  ],
                })
                .then(async (confirm) => {
                  if (confirm === '네') {
                    const upload = {
                      artist: user?.artist?.id,
                      title,
                      text: text,
                      user: user?.id,
                      images: images.map(({ id }) => id),
                      product: attachedItem?.id || null,
                    };
                    try {
                      let id = prevNoteId;
                      if (prevNoteId) {
                        await update.mutateAsync({ ...upload, id: prevNoteId });
                      } else {
                        const { data: result } = await create.mutateAsync(
                          upload
                        );
                        id = result.id;
                      }
                      enqueueSnackbar('작성이 완료되었습니다.');
                      router.push(`/note/${id}`);
                    } catch (e) {
                      alert(e.message);
                    }
                  }
                });
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
          {artist ? (
            <>
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
                multiline
                onChange={(e) => {
                  setTitle(e.target.value.slice(0, 20));
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
            </>
          ) : null}
          <Input
            sx={{
              ':before, :after': {
                borderBottom: '0px !important',
              },
              pt: artist ? '24px' : '0px',
              px: artist ? 1.5 : 0,
            }}
            placeholder="노트를 작성해주세요."
            multiline
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <Box sx={{ mt: 4 }}>
            <ImageUploader
              type="2"
              images={images}
              multiple
              imageInputType="serverUploaded"
              onChange={(images) => setImages(images)}
              max={10}
            />
          </Box>
          {attachedItem ? (
            <Stack sx={{ mt: 2 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  mb: 0.5,
                }}
              >
                연결된 상품
              </Typography>
              <Typography>{attachedItem.attributes.name}</Typography>
            </Stack>
          ) : null}
          {artist ? (
            <Stack direction="row" alignItems="center">
              {attachedItem ? (
                <IconButton
                  onClick={() => {
                    setAttachedItem(null);
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: '#A3A3A3',
                    }}
                  />
                </IconButton>
              ) : null}
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
          ) : null}
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
        onClickProduct={(item) => {
          setAttachedItem(item);
          setAttachSaleItemsOpen(false);
        }}
      />
    </ScreenBox>
  );
};

export default Create;
