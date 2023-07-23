import { Tabs, Tab } from '@mui/material';
import { subTab } from '../../types/index';

type Props = {
  tabs: subTab[];
  initialTab: string;
  onChangeTab: (e: React.SyntheticEvent, value: string) => void;
};

const SubTabs = ({ tabs, initialTab, onChangeTab, sx }: Props) => (
  <Tabs
    value={initialTab}
    onChange={onChangeTab}
    textColor="primary"
    indicatorColor="primary"
    variant="fullWidth"
    centered
    sx={[styles.tabContainer, sx]}
  >
    {tabs.map((tab) => {
      const { id, label } = tab;

      return <Tab key={id} value={id} label={label} sx={styles.tab} />;
    })}
  </Tabs>
);

const styles = {
  tabContainer: {
    borderBottom: '1px solid #eee',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
  },
  tab: {
    fontWeight: 700,
    fontSize: '14px',
    color: '444',
  },
};

export default SubTabs;
