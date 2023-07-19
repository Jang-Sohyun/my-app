import { useState, useRef } from 'react';
import Text from '@mui/material/Typography';
import {
  Box,
  OutlinedInput,
  MenuItem,
  FormControl,
  TextField,
  Button,
} from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import NextButton from 'components/NextButton';
import { useDdleContext } from 'contexts/Ddle';
import { useSnackbar } from 'notistack';
import { apis } from 'apis/index';
import { useRouter } from 'next/router';
import { useContext as useConfirm } from 'contexts/confirm';

function getStyles(name: string, typeName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      typeName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function MultipleSelectPlaceholder({ inputRef }: any) {
  const theme = useTheme();
  const [typeName, setTypeName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof typeName>) => {
    const {
      target: { value },
    } = event;
    setTypeName(value);
  };

  return (
    <FormControl sx={styles.formControl}>
      <Select
        sx={styles.selectBox}
        displayEmpty
        value={typeName}
        onChange={handleChange}
        input={<OutlinedInput inputRef={inputRef} />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>문의 유형을 선택해주세요</em>;
          }

          return selected;
        }}
        inputProps={{ 'aria-label': '문의 유형 선택' }}
      >
        {['주문/결제', '회원정보', '신고하기', '서비스/기타'].map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, typeName, theme)}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

const Inquiry = () => {
  // 입력시 별도의 실시간 validation이 필요하지 않기 때문에
  // ref를 이용하여 저장이벤트 발생시에 최근 값을 가져오도록 함
  const inputTypeRef = useRef(null);
  const inputTitleRef = useRef(null);
  const inputDescriptionRef = useRef(null);
  const { user } = useDdleContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [, confirm] = useConfirm();
  const onClickSaveButton = async () => {
    const inputType = inputTypeRef.current;
    const inputTitle = inputTitleRef.current;
    const inputDescription = inputDescriptionRef.current;

    // 사용자 입력값 validation
    if (inputType.value == '') {
      alert('문의 유형을 선택해주세요');
      inputType.focus();
      return;
    }

    if (inputTitle.value == '') {
      alert('문의 제목을 입력해주세요');
      inputTitle.focus();
      return;
    }

    if (inputDescription.value == '') {
      alert('문의 내용을 입력해주세요');
      inputDescription.focus();
      return;
    }

    // example
    // const postData = {
    //   type: inputType.value,
    //   title: inputTitle.value,
    //   text: inputDescription.value,
    //   user: user.id,
    // };
    const postData = {
      user: user.id,
      desc: inputDescription?.value || '',
      title:
        inputType && inputDescription
          ? `[${inputType?.value}] ${inputTitle?.value}`
          : '',
    };
    try {
      confirm
        .open({
          title: '문의를 작성하시겠습니까?',
          buttons: [
            {
              label: '아니요',
            },
            {
              label: '예',
              isDanger: true,
            },
          ],
        })
        .then(async (answer) => {
          if (answer === '예') {
            await apis.productInquery.create(postData);
            enqueueSnackbar('문의가 등록되었습니다.');
            router.push('/profile');
          }
        });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Box sx={styles.wrapper}>
      <Text component="legend" sx={styles.inputLabelText}>
        유형 선택
      </Text>
      <MultipleSelectPlaceholder inputRef={inputTypeRef} />
      <Text component="legend" sx={styles.inputLabelText}>
        문의 내용
      </Text>

      <OutlinedInput
        placeholder="제목을 입력하세요(최대 20자)"
        defaultValue=""
        inputRef={inputTitleRef}
        sx={styles.input}
      />

      <TextField
        multiline
        rows={7}
        defaultValue=""
        inputRef={inputDescriptionRef}
        placeholder="문의하실 내용을 입력해 주세요"
        InputProps={{ sx: styles.inputTextarea }}
      />

      <Box sx={styles.mustRead}>
        <Text>* 필독</Text>
        <Text sx={styles.description}>
          주문 및 배송문의는 <b>판매 작가의 문의하기</b>를 이용해주세요.
        </Text>
        <Text sx={styles.description}>
          <br />
          문의하기는 48시간 이내에 답변드립니다. <br />
          토,일,공휴일,연휴 기간에는 답변이 늦어질 수 있으니 <br />
          양해 부탁드립니다.
        </Text>
      </Box>

      <NextButton label="저장하기" onClick={onClickSaveButton} />
    </Box>
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
  input: {
    height: '52px',
    borderRadius: '13px',
  },
  inputTextarea: {
    mt: 2,
    height: '200px',
    borderRadius: '13px',
  },
  inputLabelText: {
    paddingLeft: '10px',
    marginTop: '30px',
  },
  formControl: {
    width: '100%',
    height: '52px',
    borderRadius: '13px',
  },
  selectBox: {
    borderRadius: '13px',
  },
  mustRead: {
    paddingTop: 2,
  },
  description: {
    fontSize: '13px',
  },
};

export default Inquiry;
