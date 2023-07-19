import { List, ListItemButton, ListItemText } from '@mui/material';
import { SubMenuType } from 'types/index';

const SubMenuListItem = ({ label, pageName, onClick }: SubMenuType) => {
  return (
    <List component="div" disablePadding>
      <ListItemButton sx={styles.listItemButton} onClick={onClick}>
        <ListItemText
          primary={label}
          disableTypography={true}
          sx={styles.listItemText}
        />
      </ListItemButton>
    </List>
  );
};

const styles = {
  listItemButton: {
    pl: 4,
    py: 0.5,
  },
  listItemText: {
    fontWeight: 600,
  },
};

export default SubMenuListItem;
