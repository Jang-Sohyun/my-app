import {
  Modal,
  ModalProps,
  Stack,
  Typography,
  ButtonGroup,
  Button,
} from '@mui/material';

export interface AlertButton {
  label: string;
  isDanger?: boolean;
  onClick?: () => void;
}
interface Props extends Omit<ModalProps, 'children'> {
  title: string;
  subTitle?: string | null;
  buttons: [AlertButton] | [AlertButton, AlertButton];
}
const Alert = ({ title, subTitle, buttons, ...rest }: Props) => (
  <Modal {...rest}>
    <Stack
      sx={{
        position: 'absolute',
        width: '320px',
        background: '#fff',
        margin: 'auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Typography
        sx={{
          pt: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          mb: 0.5,
          px: 2,
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      {subTitle && (
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '14px',
            color: (theme) => theme.palette.grey[500],
            px: 2,
            whiteSpace: 'pre-line',
          }}
        >
          {subTitle}
        </Typography>
      )}
      <ButtonGroup
        fullWidth
        size="large"
        sx={{ borderRadius: 0, mt: 3, overflow: 'hidden' }}
      >
        {buttons
          .filter((b) => b)
          .map((button, i) => (
            <Button
              key={i}
              sx={{
                borderRadius: 0,
                borderColor: (theme) => theme.palette.grey[300],
                color: button.isDanger
                  ? 'rgb(248, 94, 58)'
                  : (theme) => theme.palette.grey[800],
                ':hover, :active': {
                  borderColor: (theme) => theme.palette.grey[300],
                  color: button.isDanger
                    ? 'rgb(248, 94, 58)'
                    : (theme) => theme.palette.grey[800],
                },
              }}
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          ))}
      </ButtonGroup>
    </Stack>
  </Modal>
);

export default Alert;
