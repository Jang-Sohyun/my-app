import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import { subTabsInCustomerSuport } from 'constants/subTabs';
import SubTabs from 'components/common/SubTabs';
import Faq from 'components/profile/Faq';
import InquiryHistory from 'components/profile/InquiryHistory';
import Inquiry from 'components/profile/Inquiry';
import { useRouter } from 'next/router';

type Props = {
  onClickGoBack: () => void;
  initialTab: string;
};

const CustomerSupport = ({ initialTab }: Props) => {
  const router = useRouter();
  const selected = router.query.tab || 'faq';

  return (
    <ScreenBox>
      <BasicAppBar title="고객센터" />

      <SubTabs
        tabs={subTabsInCustomerSuport}
        initialTab={selected || 'faq'}
        onChangeTab={(_, tab) => {
          router.replace(`/inqueries?tab=${tab}`);
        }}
      />
      {selected === 'faq' && <Faq />}
      {selected === 'inquiry_history' && <InquiryHistory />}
      {selected === 'inquiry' && <Inquiry />}
    </ScreenBox>
  );
};

export default CustomerSupport;
