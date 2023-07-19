import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

type TabSize = 'small' | 'medium' | 'large';

type Props = {
  size: TabSize;
  tabs: {
    text: string;
    type?: string;
  }[];
  selectedTab: any;
  onChange?: (tabIndex: number) => void;
};

export default function ScrollableTabs({
  size = 'small',
  tabs,
  selectedTab,
  onChange,
}: Props) {
  let tabSize = styles.tabSmall;
  if (size == 'medium') {
    tabSize = styles.tabMedium;
  } else if (size == 'large') {
    tabSize = styles.tabLarge;
  } else {
    tabSize = styles.tabSmall;
  }

  return (
    <Box sx={styles.container}>
      <Tabs
        value={selectedTab}
        onChange={(_, v) => onChange(v)}
        variant="scrollable"
        scrollButtons={false}
        allowScrollButtonsMobile
        TabIndicatorProps={{ sx: styles.tabIndicator }}
        aria-label="Category tab"
      >
        {tabs.map((item, i) => (
          <Tab
            key={item}
            disableRipple
            // sx={{ background: 'red' }}
            sx={[
              { ...styles.tab, ...tabSize },
              { mr: 1 },
              i === 0
                ? {
                    ml: 3,
                  }
                : {},
            ]}
            label={item}
          />
        ))}
      </Tabs>
    </Box>
  );
}

const styles = {
  container: { my: 1, width: '100%' },
  tab: {
    '&.Mui-selected': {
      backgroundColor: 'rgb(65,65,65)',
      color: '#fff',
      border: '1px solid rgb(65,65,65)',
    },
    // paddingRight: '80px',
    backgroundColor: '#fff',
    color: '#444',
    border: '1px solid rgb(65,65,65)',
  },
  tabSmall: {
    // width: '54px',
    height: '34px',
    fontSize: '14px',
    minWidth: '20px',
    minHeight: '20px',
    borderRadius: '18px',
    padding: '5px 12px 5px',
    margin: '0 2px',
  },
  tabMedium: {
    width: '68px',
    height: '34px',
    fontSize: '14px',
    minWidth: '20px',
    minHeight: '20px',
    borderRadius: '18px',
    padding: '5px',
    margin: '0 2px',
  },
  tabLarge: {
    width: '82px',
    height: '34px',
    fontSize: '14px',
    minWidth: '20px',
    minHeight: '20px',
    borderRadius: '18px',
    padding: '5px',
    margin: '0 2px',
  },
  tabIndicator: {
    display: 'none',
  },
};
