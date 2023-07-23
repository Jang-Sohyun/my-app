import ScreenBox from '../../components/ScreenBox';
import BasicAppBar from '../../components/common/BasicAppBar';
import InquiryHistory from '../../components/profile/InquiryHistory';

const CustomerSupport = () => {
  return (
    <ScreenBox>
      <BasicAppBar title="문의 답변하기" />
      <InquiryHistory answerMode />
    </ScreenBox>
  );
};

export default CustomerSupport;
