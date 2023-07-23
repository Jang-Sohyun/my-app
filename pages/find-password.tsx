import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ScreenBox from '../components/ScreenBox';
import Text from '@mui/material/Typography';
import { Box, OutlinedInput } from '@mui/material';
import BasicAppBar from '../components/common/BasicAppBar';
import GuidanceTitle from '../components/GuidanceTitle';
import NextButton from '../components/NextButton';

const FindPassword = () => {
  const router = useRouter();

  const [userInput, setUserInput] = useState('');

  // 뒤로가기 버튼 클릭시 이전 단계 화면으로 이동한다.
  const onClickGoBack = () => {
    // 로그인 페이지로 이동
    router.push('/login');
  };

  const onClickButton = () => {
    // TODO : 입력받은 아이디(이메일)로 비밀번호 재설정 요청 API 호출
    if (userInput == '') {
      alert('아이디를 입력해주세요.');
      return;
    }

    alert(
      `TODO : 입력받은 아이디(${userInput})로 비밀번호 재설정 요청 API 호출`
    );
  };

  return (
    <ScreenBox>
      <BasicAppBar />
      <Box sx={styles.wrapper}>
        <GuidanceTitle>비밀번호를 잊으셨나요?</GuidanceTitle>

        <Text>
          아이디 또는 이메일을 입력하시면
          <br />
          가입하실때 사용하신 이메일로 비밀번호를 재설정 할 수 있는 링크를
          보내드립니다.
        </Text>

        <Text component="legend" mt={3} sx={styles.topLabelText}>
          아이디
        </Text>
        <OutlinedInput
          type="text"
          sx={styles.userInfoInput}
          placeholder="아이디 및 이메일을 입력해주세요"
          defaultValue=""
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
        />

        <NextButton
          label="완료하기"
          onClick={() => {
            onClickButton();
          }}
        />
      </Box>
    </ScreenBox>
  );
};

const styles = {
  wrapper: {
    width: '85%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'left',
  },
  topLabelText: {
    paddingLeft: '10px',
  },
  userInfoInput: {
    height: '52px',
    borderRadius: '13px',
  },
};

export default FindPassword;
