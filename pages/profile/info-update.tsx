import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import { Button, Stack, Typography } from '@mui/material';
import TextInput from 'components/TextInput';
import { useState, useEffect } from 'react';
import { Close } from '@mui/icons-material';
import { apis } from 'apis';
import { useDdleContext } from 'contexts/Ddle';
import { useContext as useConfirm } from 'contexts/confirm';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

type InputsProps = {
  label: string;
  max: number;
  // onClickRemove: (idx) => void;
  onChangeInputs: (inputs) => void;
  inputs: string[];
  placeholder: string;
};
const Inputs = (props: InputsProps) => (
  <Stack sx={{ width: '100%' }}>
    <Typography sx={{ fontSize: 13, marginLeft: '18px' }}>
      {props.label} <span style={{ fontSize: 11 }}>*최대 {props.max}개</span>
    </Typography>
    {props.inputs.map((text, i) => {
      return (
        <Stack direction="row" key={i} sx={{ width: '100%' }}>
          <TextInput
            size="small"
            label=""
            value={text}
            containerSx={{ width: '100%' }}
            sx={{ fontSize: 14 }}
            onChange={(e) => {
              const next = [...props.inputs];
              next[i] = e.target.value.replace(/,/, '');
              props.onChangeInputs(next);
            }}
            endAdornment={
              (i === 0 && text) || i > 0 ? (
                <Close
                  sx={{ transform: 'scale(0.6)' }}
                  role="button"
                  onClick={() => {
                    const next = [...props.inputs];
                    if (i === 0) {
                      next[i] = '';
                    } else {
                      next.splice(i, 1);
                    }
                    props.onChangeInputs(next);
                  }}
                />
              ) : null
            }
            placeholder={props.placeholder}
          />
        </Stack>
      );
    })}
    {props.inputs.length < props.max ? (
      <TextInput
        label=""
        size="small"
        sx={{
          fontSize: 14,
          '& .MuiInputBase-input': {
            textAlign: 'center !important',
            '::placeholder': {
              color: '#000 !important',
              opacity: 1,
              WebkitTextFillColor: '#000 !important',
            },
          },
        }}
        disabled
        placeholder={'+ 추가'}
        role="button"
        onClick={() => {
          props.onChangeInputs([...props.inputs, '']);
        }}
      />
    ) : null}
  </Stack>
);

const Update = () => {
  const ddle = useDdleContext();
  const [schools, setSchools] = useState(['']);
  const [histories, setHistories] = useState(['']);
  const [activities, setActivities] = useState(['']);
  const { mutateAsync: update, isLoading } = apis.artist.useUpdate();
  const [, confirm] = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    if (ddle.user) {
      const { artist } = ddle.user;
      if (artist.schools) {
        setSchools(artist.schools?.split(','));
      }
      if (artist.histories) {
        setHistories(artist.histories?.split(','));
      }
      if (artist.activities) {
        setActivities(artist.activities?.split(','));
      }
    }
  }, [ddle.user]);

  return (
    <ScreenBox>
      <BasicAppBar title="작가 정보 수정" />

      <Stack
        sx={{ px: '20px', pb: '20%', pt: '12px', width: '100%' }}
        spacing={2}
      >
        <Typography
          sx={{ fontSize: 15, mb: 1, fontWeight: 'bold', marginLeft: '18px' }}
        >
          이력
        </Typography>
        <Inputs
          label="졸업 학교"
          max={3}
          onChangeInputs={setSchools}
          inputs={schools}
          placeholder="대학교,학과 입력 ex) 숙명여자대학교 회화과 학사"
        />
        <Inputs
          label="전시이력"
          max={30}
          onChangeInputs={setHistories}
          inputs={histories}
          placeholder="날짜,전시이름,장소 ex) 2023 ddle 올해의작가상 연합전,서울"
        />
        <Inputs
          label="그 외 활동"
          max={30}
          onChangeInputs={setActivities}
          inputs={activities}
          placeholder="콜라보 및 협업,공모수상,예술관련 이력 등"
        />
        <Button
          variant="contained"
          fullWidth
          disabled={isLoading}
          sx={{
            py: '10px',
            borderRadius: 6,
            background: 'rgb(14, 12, 39)',
            '&:hover': {
              background: 'rgb(14, 12, 39)',
            },
            '&:active': {
              background: 'rgb(14, 12, 39)',
            },
          }}
          onClick={() => {
            if (ddle.user?.artist?.id) {
              confirm
                .open({
                  title: '저장하시겠습니까?',
                  buttons: [
                    { label: '취소' },
                    { label: '저장', isDanger: true },
                  ],
                })
                .then(async (confirm) => {
                  if (confirm === '저장' && ddle.user?.artist.id) {
                    await update({
                      id: ddle.user.artist.id,
                      schools: schools.filter(Boolean).join(','),
                      histories: histories.filter(Boolean).join(','),
                      activities: activities.filter(Boolean).join(','),
                    });
                    ddle.setUserFromJwtOrClear();
                    enqueueSnackbar('저장이 완료되었습니다.');
                    router.replace('/profile');
                  }
                });
            }
          }}
        >
          저장하기
        </Button>
      </Stack>
    </ScreenBox>
  );
};

export default Update;
