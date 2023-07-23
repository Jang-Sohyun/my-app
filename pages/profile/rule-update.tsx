import ScreenBox from '../../components/ScreenBox';
import BasicAppBar from '../../components/common/BasicAppBar';
import { Button, Stack, Typography } from '@mui/material';
import TextInput from '../../components/TextInput';
import { useState, useEffect } from 'react';
import { useContext as useConfirm } from '../../contexts/confirm';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { apis } from '../../apis';
import { useDdleContext } from '../../contexts/Ddle';

const RULE_PLACEHOLDER = `상세 규정 내용을 작성해주세요.

Ex) 저의 작업물을 수작업으로 페인팅 작업을 하다보니 붓결이 일정하지 않을 수 있습니다. 화면과 다르다는 이유로 환불이 되지 않으니 이점 유의하고 구매해주시면 감사하겠습니다.`;

const DELIVERY_PLACEHOLDER = `배송에 대해 작성해주세요.

Ex) 우체국 택배로 발송이 되며, 발송 후 메시지를 보내드립니다. 가로/세로 90cm이상 넘어갈 시 용달 배송으로 진행이 되며 거리에 따라 추가 비용이 있음을 알려드립니다.`;

const EXCHANGE_PLACEHOLDER = `교환/환불에 대해 작성해주세요.

Ex) 7일이내 교환,환불이 가능합니다. 다만 작품에 손상이 있을 시 환불이 어렵습니다. 색상이 변색이 될 경우 언제든지 A/S가 가능하며 전체/부분 교체에 따라 비용이 달라집니다.`;

const Update = () => {
  const ddle = useDdleContext();
  const [rule, setRule] = useState('');
  const [deliveryRule, setDeliveryRule] = useState('');
  const [refundRule, setRefundRule] = useState('');

  const { mutateAsync: update, isLoading } = apis.artist.useUpdate();
  const [, confirm] = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    if (ddle.user) {
      const { artist } = ddle.user;
      if (artist.rule) {
        setRule(artist.rule);
      }
      if (artist.deliveryRule) {
        setDeliveryRule(artist.deliveryRule);
      }
      if (artist.refundRule) {
        setRefundRule(artist.refundRule);
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
          규정
        </Typography>
        <TextInput
          label="규정 내용"
          value={rule}
          multiline
          sx={{ fontSize: 14 }}
          onChange={(e) => {
            setRule(e.target.value);
          }}
          rows={6}
          placeholder={RULE_PLACEHOLDER}
        />
        <TextInput
          label="배송 관련"
          value={deliveryRule}
          multiline
          sx={{ fontSize: 14 }}
          onChange={(e) => {
            setDeliveryRule(e.target.value);
          }}
          rows={6}
          placeholder={DELIVERY_PLACEHOLDER}
        />
        <TextInput
          label="교환/환불"
          value={refundRule}
          multiline
          sx={{ fontSize: 14 }}
          onChange={(e) => {
            setRefundRule(e.target.value);
          }}
          rows={6}
          placeholder={EXCHANGE_PLACEHOLDER}
        />
        <Button
          variant="contained"
          fullWidth
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
                      rule,
                      deliveryRule,
                      refundRule,
                    });
                    enqueueSnackbar('저장이 완료되었습니다.');
                    ddle.setUserFromJwtOrClear();
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
