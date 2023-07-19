import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Collapse,
  Typography as Text,
  Typography,
  Button,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useState } from 'react';
import TextInput from 'components/TextInput';
import dayjs from 'dayjs';

type Props = {
  type: 'faq' | 'inquiry_history';
  list: any[];
  onClickList: (id: string) => void;
};

const NestedListWithCollabse = ({
  type,
  list,
  onClickList,
  onAnswer,
}: Props) => {
  const [opened, setOpened] = useState<number[]>([]);
  return (
    <List sx={styles.listContainer} component="nav">
      {list.length === 0 ? (
        type === 'inquiry_history' ? (
          <Stack alignItems="center" justifyContent="center" sx={{ mt: 16 }}>
            <DescriptionRoundedIcon
              sx={{
                color: (theme) => theme.palette.grey[500],
                fontSize: 40,
                mb: 1,
              }}
            />

            <Text sx={{ size: 15, color: (theme) => theme.palette.grey[500] }}>
              진행중인 문의가 없어요
            </Text>
          </Stack>
        ) : null
      ) : null}
      {list.map((listItem, idx) => {
        const isOpened = opened.includes(idx);
        return (
          <Box key={listItem.id}>
            {
              // FAQ는 상단에 그룹 유형 헤더를 표시한다.
              type == 'faq' && listItem.isFirstInTypeGroup && (
                <Text sx={styles.subheaderText}>{listItem.relatedType}</Text>
              )
            }

            {
              // 문의내역은 상단에 진행상태와 작성일자를 표시한다.
              type == 'inquiry_history' && listItem.status && (
                <Stack direction="row">
                  <Text sx={styles.statusText}>{listItem.status}</Text>
                  <Text sx={styles.createdAt}>
                    {dayjs(listItem.createdAt).fromNow()}
                  </Text>
                </Stack>
              )
            }
            <ListItemButton
              sx={styles.listItem}
              onClick={() => {
                setOpened((prev) => {
                  const newArr = prev.slice();
                  const idxInNewArr = newArr.indexOf(idx);
                  if (idxInNewArr > -1) {
                    newArr.splice(idxInNewArr, 1);
                  } else {
                    newArr.push(idx);
                  }
                  return newArr;
                });
                // onClickList(listItem.id);
              }}
            >
              <ListItemText primary={listItem.title} />
              {isOpened ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isOpened} timeout="auto" unmountOnExit>
              {type == 'inquiry_history' && (
                <Stack>
                  <Typography
                    sx={{
                      background: '#eee',
                      px: '20px',
                      pt: '10px',
                      fontSize: '15px',
                      whiteSpace: 'pre-line',
                      margin: 0,
                    }}
                  >
                    {listItem.title}
                  </Typography>
                  <Typography
                    sx={{
                      background: '#eee',
                      px: '20px',
                      pt: '10px',
                      fontSize: '12px',
                      whiteSpace: 'pre-line',
                      margin: 0,
                    }}
                  >
                    {listItem.body}
                  </Typography>
                </Stack>
              )}
              <List component="div" disablePadding>
                <ListItemText
                  disableTypography
                  sx={styles.listItemText}
                  primary={
                    // FAQ인 경우 상세설명, 그 외에는 답변 데이터를 렌더
                    type == 'faq' ? listItem.description : listItem.answered
                  }
                />
              </List>
              {onAnswer && !listItem.answered ? (
                <Stack
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onAnswer({
                      id: listItem.id,
                      text: e.currentTarget.answer.value,
                    });
                  }}
                >
                  <TextInput
                    containerSx={{ mt: 0.5 }}
                    label="답변 달기"
                    multiline
                    name="answer"
                  />
                  <Stack alignItems="flex-end">
                    <Button type="submit">작성</Button>
                  </Stack>
                </Stack>
              ) : null}
            </Collapse>
          </Box>
        );
      })}
    </List>
  );
};

const styles = {
  listContainer: {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
  },
  subheaderText: {
    fontSize: '13px',
    padding: '10px 0px 10px 3px',
    color: '#444',
    marginTop: '20px',
  },
  statusText: {
    fontWeight: 700,
    fontSize: '13px',
    padding: '10px 0px 5px 3px',
    marginRight: 'auto',
  },
  createdAt: {
    fontSize: '13px',
    padding: '10px 0px 5px 3px',
    marginLeft: 'auto',
  },
  listItem: {
    padding: 0.5,
    borderBottom: '1px solid #ddd',
  },
  listItemText: {
    background: '#eee',
    padding: '20px',
    fontSize: '13px',
    whiteSpace: 'pre-line',
    margin: 0,
  },
};

export default NestedListWithCollabse;
