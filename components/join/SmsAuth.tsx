import Text from '@mui/material/Typography';
import { Stack, OutlinedInput, Button } from '@mui/material';
import GuidanceTitle from 'components/GuidanceTitle';
import { Check, PriorityHigh } from '@mui/icons-material';

type Props = {
  authButtonEnabled: boolean;
  authCompleted: boolean;
  onChangeCellphone?: (value: string) => void | null;
  onClickSmsAuth?: () => void | null;
  onChangeSmsAuthKey?: (value: string) => void | null;
};

const SmsAuth = ({
  authButtonEnabled,
  authCompleted,
  cellPhone,
  onChangeCellphone,
  onClickSmsAuth,
  authKey,
  onChangeSmsAuthKey,
  disableCellPhone,
  disableSmsKey,
  requested,
  loadingSms,
}: Props) => (
  <>
    <GuidanceTitle>휴대폰 인증을 해주세요.</GuidanceTitle>

    <Text component="legend" sx={styles.topLabelText}>
      휴대폰 번호
    </Text>
    <Stack direction="row" spacing={2} sx={styles.alignItem}>
      <OutlinedInput
        sx={styles.smsAuthInput}
        autoFocus={true}
        fullWidth
        placeholder="01012345678"
        defaultValue=""
        value={cellPhone}
        disabled={disableCellPhone}
        onChange={(e) => onChangeCellphone?.(e.target.value)}
      />
      <Button
        variant="outlined"
        size="medium"
        sx={styles.smsAuthButton}
        disabled={!authButtonEnabled || requested || loadingSms}
        onClick={() => onClickSmsAuth?.()}
      >
        {loadingSms ? '전송 중' : requested ? '전송완료' : '인증받기'}
      </Button>
    </Stack>
    <Text component="legend" sx={styles.inputLabelText}>
      인증 번호
    </Text>
    <OutlinedInput
      placeholder="인증번호 6자리"
      endAdornment={authCompleted ? <Check /> : null}
      defaultValue=""
      sx={styles.smsAuthInput}
      value={authKey}
      disabled={disableSmsKey}
      onChange={(e) => {
        onChangeSmsAuthKey?.(e.target.value.slice(0, 6));
      }}
    />
  </>
);

const styles = {
  alignItem: {
    alignContent: 'flex-start',
  },
  smsAuthInput: {
    height: '52px',
    borderRadius: '13px',
  },
  smsAuthButton: {
    '&:disabled': {
      border: '2px solid #eff0f1',
      backgroundColor: '#eff0f1',
      color: '#c3c3c3',
    },
    '&:hover': {
      border: '2px solid #414141',
      backgroundColor: '#414141',
      color: '#fff',
    },
    '&:active': {
      border: '2px solid #414141',
      backgroundColor: '#414141',
      color: '#fff',
    },
    border: '2px solid #0e0c27',
    height: '52px',
    borderRadius: '22px',
    fontSize: '14px',
    width: '120px',
    backgroundColor: '#0e0c27',
    color: '#fff',
  },
  topLabelText: {
    paddingLeft: '10px',
  },
  inputLabelText: {
    paddingLeft: '10px',
    marginTop: '30px',
  },
  inputWarningIcon: {
    color: 'red',
  },
};

export default SmsAuth;
