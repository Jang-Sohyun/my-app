import { List, Stack, ListSubheader, Typography as Text } from '@mui/material';

const NestedList = ({ subHeader, items }) => (
  <List
    sx={styles.menuList}
    component="nav"
    aria-labelledby="nested-list-subheader"
    subheader={<ListSubheader component="div">{subHeader}</ListSubheader>}
  >
    {items.map((item) => (
      <List key={item.label} component="div" disablePadding>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          sx={styles.listItem}
        >
          <Text sx={styles.listItemLabel}> {item.label} </Text>
          <Text sx={styles.listItemValue}> {item.text} </Text>
        </Stack>
      </List>
    ))}
  </List>
);

const styles = {
  menuList: {
    width: '100%',
    bgcolor: 'background.paper',
  },
  listItem: {
    pb: '13px',
  },
  listItemLabel: {
    pl: 4,
    py: 0.8,
    fontWeight: 600,
    width: '30%',
  },
  listItemValue: {
    width: '70%',
    fontWeight: 500,
    fontSize: '14px',
    textAlign: 'left',
  },
};

export default NestedList;
