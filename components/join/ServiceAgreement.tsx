import { useRouter } from 'next/router';
import Text from '@mui/material/Typography';
import {
  FormGroup,
  FormControlLabel,
  Box,
  Checkbox,
  Divider,
} from '@mui/material';
import GuidanceTitle from 'components/GuidanceTitle';
import CheckBoxWithLabel from 'components/CheckBoxWithLabel';

type Props = {
  isCheckAll: boolean;
  agreements: any;
  onChangeCheckAll?: (e: any) => void | null;
  onChangeCheck?: (e: any, id: number) => void | null;
};

const ServiceAgreement = ({
  isCheckAll,
  agreements,
  onChangeCheckAll,
  onChangeCheck,
}: Props) => {
  const router = useRouter();

  return (
    <>
      <GuidanceTitle>
        서비스 이용 약관에
        <br />
        동의해주세요.
      </GuidanceTitle>

      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          checked={isCheckAll}
          label="네, 모두 동의합니다."
          onChange={(e) => onChangeCheckAll?.(e)}
        />

        <Box my={2}>
          <Divider />
        </Box>

        {agreements.map((item) => {
          const { id, label, isChecked, isRequire, url } = item;

          let labelText = isRequire ? '(필수) ' : '(선택) ';
          labelText += label;

          return (
            <CheckBoxWithLabel
              key={id}
              checked={isChecked}
              label={labelText}
              onCheckBoxChange={(e) => onChangeCheck?.(e, id)}
              onButtonClick={
                item.url !== ''
                  ? () => {
                      router.push(url);
                    }
                  : null
              }
            />
          );
        })}
      </FormGroup>

      <Text mt={3} sx={styles.guidanceMessage}>
        ‘선택’ 항목에 동의하지 않아도 서비스 이용이 가능합니다. <br />
        개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 동의 거부 시
        회원제 서비스 이용이 제한됩니다.
      </Text>
    </>
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
  guidanceMessage: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#b7b7b7',
  },
};

export default ServiceAgreement;
