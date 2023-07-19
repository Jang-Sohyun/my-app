import { useEffect, useState } from 'react';
import ScreenBox from 'components/ScreenBox';
import {
  Stack,
  IconButton,
  Avatar,
  Typography,
  Chip,
  Input,
  Button,
} from '@mui/material';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import PanoramaIcon from '@mui/icons-material/Panorama';
import ImgInput from 'components/ImgInput';
import Close from '@mui/icons-material/Close';
import { apis } from 'apis';
import { CATEGORIES, STYLES } from 'constants/artistTags';
import { useDdleContext } from 'contexts/Ddle';
import { useContext as useConfirm } from 'contexts/confirm';
import { useSnackbar } from 'notistack';
import SelectableList from 'components/SelectableList';

const InputField = ({ label, value, onChange, placeholder }) => (
  <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
    <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: '22px' }}>
      {label}
    </Typography>
    <Input
      sx={{
        ':before, :after': {
          borderBottom: '0px !important',
        },
        fontSize: 13,
        flex: 1,
        width: '100%',
      }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </Stack>
);

const ArtistProfile = () => {
  const router = useRouter();
  const { user, setUserFromJwtOrClear } = useDdleContext();
  const [, confirm] = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const [backgroundImg, setBackgroundImg] = useState();
  const [profileImg, setProfileImg] = useState();

  const [nicknameInput, setNicknameInput] = useState('');
  const [introInput, setIntroInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [notiOn, setNotiOn] = useState(true);

  const [crop, setCrop] = useState<Crop>();

  useEffect(() => {
    if (user?.artist) {
      if (!user?.artist.nickname) {
        // setNotiOn(true);
      }
      setNicknameInput(user?.artist.nickname);
      setIntroInput(user?.artist.oneLiner);
      setBackgroundImg(user?.artist.background);
      setProfileImg(user?.artist.avatar);
      if (user?.artist.categories) {
        setSelectedCategories(user.artist.categories?.split(','));
      }
      if (user?.artist.styles) {
        setSelectedStyles(user.artist.styles?.split(','));
      }
    }
  }, [user?.artist]);
  return (
    <>
      <ScreenBox noBottomBar>
        <Box
          sx={{ width: '100%', overflow: 'hidden' }}
          component="label"
          role="button"
        >
          <Box
            sx={{
              width: '100%',
              paddingTop: '56.25%',
              position: 'relative',
            }}
          >
            <ImgInput
              type="serverUploaded"
              onUpload={(result) => {
                setBackgroundImg(result);
              }}
            />

            {backgroundImg ? (
              <Box
                component={'img'}
                src={backgroundImg?.url}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            ) : (
              <>
                <PanoramaIcon
                  sx={{
                    fontSize: '48px',
                    color: (theme) => theme.palette.grey[500],
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 13,
                    color: (theme) => theme.palette.grey[600],
                  }}
                >
                  작가 페이지 배경화면
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            zIndex: 1100,
            position: 'relative',
            width: '100%',
          }}
          component="label"
          role="button"
        >
          <ImgInput
            type="serverUploaded"
            onUpload={(result) => {
              setProfileImg(result);
            }}
          />

          <Avatar
            sx={{
              width: '95px',
              height: '95px',
              position: 'absolute',
              left: '20px',
              bottom: '-32px',
              boxShadow: 'rgb(0 0 0 / 24%) 0px 3px 8px',
              cursor: 'pointer',
            }}
            src={profileImg ? profileImg.url : ''}
          />
        </Box>
        <Stack
          alignItems="flex-start"
          sx={{
            backgroundColor: '#F7F7F7',
            flex: 1,
            width: '100%',
            height: '100%',
            borderTop: '1px solid rgb(236, 236, 236)',
            paddingTop: '50px',
          }}
        >
          <Stack
            alignItems="flex-end"
            sx={{ marginTop: '-40px', right: '16px', position: 'absolute' }}
          >
            <Typography sx={{ fontSize: 10, color: '#aaaaaa' }}>
              배경 권장 사이즈: 1280x720 (16:9)
            </Typography>{' '}
            <Typography sx={{ fontSize: 10, color: '#aaaaaa' }}>
              프로필 권장 사이즈: 512x512 (1:1)
            </Typography>
          </Stack>
          <Stack
            alignItems="flex-start"
            sx={{ px: '22px', width: '100%' }}
            spacing={1.8}
          >
            <InputField
              label="활동예명"
              placeholder="활동예명을 작성해주세요."
              value={nicknameInput}
              onChange={(e) => {
                setNicknameInput(e.target.value);
              }}
            />
            <InputField
              label="한줄소개"
              placeholder="20자 내외로 입력해주세요."
              value={introInput}
              onChange={(e) => {
                setIntroInput(e.target.value.slice(0, 20));
              }}
            />
            <Stack
              sx={{ pt: 1 }}
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <Typography sx={{ fontWeight: 'bold' }}>작가 키워드</Typography>
              <Chip
                label="Beta"
                size="small"
                sx={{ background: '#000', color: '#fff', padding: '2px 4px' }}
              />
            </Stack>
            <SelectableList
              label="카테고리"
              subLabel="*주종목 2개만 선택"
              selectableItems={CATEGORIES}
              selectedItems={selectedCategories}
              onSelect={(item) => {
                setSelectedCategories((prev) => {
                  const next = [...prev];
                  const foundIdx = prev.indexOf(item);
                  if (foundIdx > -1) {
                    next.splice(foundIdx, 1);
                    return next;
                  } else {
                    next.push(item);
                    if (next.length > 2) {
                      alert('2개만 선택 가능합니다.');
                      return prev;
                    } else {
                      return next;
                    }
                  }
                });
              }}
            />
            <SelectableList
              label="스타일"
              subLabel="*최대 3개 선택"
              selectableItems={STYLES}
              selectedItems={selectedStyles}
              onSelect={(item) => {
                setSelectedStyles((prev) => {
                  const next = [...prev];
                  const foundIdx = prev.indexOf(item);
                  if (foundIdx > -1) {
                    next.splice(foundIdx, 1);
                    return next;
                  } else {
                    next.push(item);
                    if (next.length > 3) {
                      alert('3개만 선택 가능합니다.');
                      return prev;
                    } else {
                      return next;
                    }
                  }
                });
              }}
            />
          </Stack>
          {notiOn && (
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                background: '#000',
                padding: '12px 30px',
                mt: 2,
              }}
            >
              <Typography sx={{ fontSize: 12, color: 'white' }}>
                프로필 사진을 자주 바꿀 경우 팬분들이 혼동이 있을 수 있으니
                대표작품 또는 시그니처 이미지를 권장드립니다.
              </Typography>
              <IconButton
                sx={{ color: 'white' }}
                onClick={() => {
                  setNotiOn(false);
                }}
              >
                <Close sx={{ fontSize: '18px' }} />
              </IconButton>
            </Stack>
          )}
          <Stack sx={{ py: 2, pb: 10, width: '100%', px: '22px' }} spacing={1}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                border: '1px solid rgb(14, 12, 39)',
                borderRadius: 12,
                boxShadow: 'none',
              }}
              onClick={() => {
                router.replace(`/artist/${user?.artist?.id}`);
              }}
            >
              내 페이지로 가기
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                background: 'rgb(14, 12, 39)',
                borderRadius: 12,
                boxShadow: 'none',
              }}
              onClick={() => {
                confirm
                  .open({
                    title: '작가정보를 저장하시겠습니까?',
                    body: '',
                    buttons: [
                      { label: '취소' },
                      { label: '저장하기', isDanger: true },
                    ],
                  })
                  .then(async (confirmed) => {
                    try {
                      const data = {
                        id: user?.artist?.id,
                        background: backgroundImg?.id,
                        avatar: profileImg?.id,
                        nickname: nicknameInput,
                        oneLiner: introInput,
                        categories: selectedCategories.join(','),
                        styles: selectedStyles.join(','),
                      };
                      if (confirmed === '저장하기') {
                        await apis.artist.update(data);
                        enqueueSnackbar('저장이 완료되었습니다.');
                      }
                      setUserFromJwtOrClear();
                      router.replace('/profile');
                    } catch (e) {
                      alert(e.message);
                    }
                  });
              }}
            >
              저장하기
            </Button>
          </Stack>
        </Stack>
      </ScreenBox>
    </>
  );
};
export default ArtistProfile;
