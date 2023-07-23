import Text from '@mui/material/Typography';
import { OutlinedInput } from '@mui/material';
import GuidanceTitle from '../../components/GuidanceTitle';

type Props = {
  userId: number;
  onChangeUserId?: (e: any) => void | null;
  artistNo: string;
  onChangeUserArtistNo?: (e: any) => void | null;
};

const MemberJoin = ({
  userId,
  onChangeUserId,
  artistNo,
  onChangeUserArtistNo,
}: Props) => (
  <>
    <GuidanceTitle>
      안녕하세요👋
      <br />
      회원 정보를 입력해주세요.
    </GuidanceTitle>

    <Text component="legend" sx={styles.inputLabelText}>
      아이디
    </Text>
    <OutlinedInput
      type="text"
      sx={styles.userInfoInput}
      placeholder="영문, 숫자 4-10자리를 입력해주세요"
      defaultValue=""
      value={userId}
      onChange={(e) => {
        onChangeUserId?.(e.target.value.trim().slice(0, 10));
      }}
    />
    <Text component="legend" sx={styles.inputLabelText}>
      입점 작가 번호{' '}
      <Text variant="caption" ml={1}>
        *입점 작가님만 입력해주세요
      </Text>
    </Text>
    <OutlinedInput
      type="text"
      sx={styles.userInfoInput}
      placeholder="코드를 입력해주세요"
      defaultValue=""
      value={artistNo}
      onChange={(e) => {
        onChangeUserArtistNo?.(e.target.value);
      }}
    />
  </>
);

const styles = {
  topLabelText: {
    paddingLeft: '10px',
  },
  inputLabelText: {
    paddingLeft: '10px',
    marginTop: '16px',
  },
  userInfoInput: {
    height: '52px',
    borderRadius: '13px',
  },
  confirmPassword: {
    height: '52px',
    borderRadius: '13px',
    marginTop: '10px',
  },
};

export default MemberJoin;
