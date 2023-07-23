import { Stack, Button, Typography, FormControl } from '@mui/material';
import ScreenBox from '../../../components/ScreenBox';
import { useEffect, useState } from 'react';
import ImageUploader from '../../../components/ImageUploader';
import { useDdleContext } from '../../../contexts/Ddle';
import { apis } from '../../../apis';
import { useContext as useConfirm } from '../../../contexts/confirm';
import { useRouter } from 'next/router';
import TextInput from '../../../components/TextInput';
import SelectableList from '../../../components/SelectableList';
import { HOME_CATEGORIES } from '../../../constants/category';
import Switch from '../../../components/Switch';
import BasicAppBar from '../../../components/common/BasicAppBar';
import Editor from '../../../components/editor';
import { useSnackbar } from 'notistack';

const Create = ({ open, onOpen, onClose, product, onSubmit }) => {
  const { user } = useDdleContext();
  const [, confirm] = useConfirm();
  const artist = user?.artist;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [price, setPrice] = useState(0);
  const [subDesc, setSubDesc] = useState('');
  const [detailHtml, setDetailHtml] = useState('');
  const [stock, setStock] = useState(1);
  const [display, setDisplay] = useState(false);

  const prevId = router.query.id;
  useEffect(() => {
    if (prevId) {
      (async () => {
        const note = await apis.product.get(Number(prevId), {
          query: { populate: '*' },
        });
        const { attributes } = note.data;

        setName(attributes.name);
        setSubDesc(attributes.subDesc);
        setStock(attributes.stock);
        setPrice(attributes.price);

        if (attributes.tags) setTags(attributes.tags?.split(','));
        setDisplay(attributes.display);
        setDetailHtml(attributes.detailHtml);
        if (attributes.images.data) {
          setImages(
            attributes.images.data.map(({ id, attributes }) => ({
              ...attributes,
              id,
            }))
          );
        }
        if (attributes.thumbnails.data) {
          setThumbnails(
            attributes.thumbnails.data.map(({ id, attributes }) => ({
              ...attributes,
              id,
            }))
          );
        }
      })();
    }
  }, [prevId]);

  const create = apis.product.useCreate();
  const update = apis.product.useUpdate();
  return (
    <ScreenBox>
      <Stack sx={{ paddingBottom: 4, width: '100%' }}>
        <BasicAppBar
          title={`상품 ${prevId ? '수정' : '생성'}`}
          rightComponent={
            <Button
              variant="contained"
              sx={{ borderRadius: 8, position: 'absolute', right: 12 }}
              onClick={() => {
                const action = prevId ? '수정' : '생성';
                confirm
                  .open({
                    title: `${action}하시겠습니까?`,
                    buttons: [
                      {
                        label: '취소',
                      },
                      {
                        label: action,
                        isDanger: true,
                      },
                    ],
                  })
                  .then(async (confirm) => {
                    if (confirm === action) {
                      if (
                        !name ||
                        !artist ||
                        !price ||
                        thumbnails.length === 0
                      ) {
                        alert('필수 정보들이 입력되지 않았습니다. ');
                      } else {
                        const params = {
                          name,
                          artist: artist.id,
                          thumbnails: thumbnails.map(({ id }) => id),
                          images: images.map(({ id }) => id),
                          tags: tags.join(','),
                          price,
                          subDesc,
                          stock,
                          display,
                          detailHtml,
                        } as any;
                        if (prevId) {
                          params.id = prevId;
                          await update.mutateAsync(params);
                        } else {
                          await create.mutateAsync(params);
                        }
                        enqueueSnackbar(`상품 ${action}이 완료되었습니다.`);
                        router.push('/profile/sales');
                      }
                    }
                  });
              }}
            >
              완료
            </Button>
          }
        />

        <Stack
          sx={{
            px: '24px',
            py: '20px',
          }}
          spacing={2}
        >
          <TextInput
            label="상품 이름"
            size="small"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextInput
            label="부연 설명"
            size="small"
            value={subDesc}
            onChange={(e) => {
              setSubDesc(e.target.value);
            }}
          />
          <TextInput
            label="재고량"
            size="small"
            type="number"
            value={stock}
            onChange={(e) => {
              const value = e.target.value;
              e.target.value = '';
              setStock(Number(value));
            }}
          />
          <TextInput
            label="가격"
            size="small"
            type="number"
            value={price}
            onChange={(e) => {
              const value = e.target.value;
              e.target.value = '';
              setPrice(Number(value));
            }}
          />

          <Stack>
            <Typography sx={{ fontSize: 12, fontWeight: '700' }}>
              썸네일
            </Typography>
            <ImageUploader
              type="2"
              images={thumbnails}
              imageInputType="serverUploaded"
              onChange={(thumbnails) => setThumbnails(thumbnails)}
              max={10}
              multiple
            />
          </Stack>
          <Stack>
            <Typography sx={{ fontSize: 12, fontWeight: '700' }}>
              상세 이미지
            </Typography>
            <ImageUploader
              type="2"
              images={images}
              imageInputType="serverUploaded"
              onChange={(images) => setImages(images)}
              max={10}
              multiple
            />
          </Stack>
          <Typography sx={{ fontSize: 12, fontWeight: '700' }}>
            상세 내용
          </Typography>
          <Editor
            value={detailHtml}
            onChange={(e) => {
              setDetailHtml(e);
            }}
          />
          <SelectableList
            label="태그"
            selectableItems={HOME_CATEGORIES}
            selectedItems={tags}
            onSelect={(item) => {
              setTags((prev) => {
                const next = [...prev];
                const foundIdx = prev.indexOf(item);
                if (foundIdx > -1) {
                  next.splice(foundIdx, 1);
                  return next;
                } else {
                  next.push(item);

                  return next;
                }
              });
            }}
          />

          <Stack spacing={1}>
            <Typography sx={{ fontSize: 12, fontWeight: '700' }}>
              리스트에 노출하기
            </Typography>
            <Switch
              checked={display}
              onChange={(e) => {
                setDisplay(e.target.checked);
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </ScreenBox>
  );
};
const styles = {
  input: {
    mb: 1,
  },
};

export default Create;
