import { Checked, UnChecked } from 'components/Icons';
import { Colors } from 'constants/theme';

type Props = { isDone: boolean };
const CheckIcon = ({ isDone }: Props) => {
  const Icon = isDone ? Checked : UnChecked;

  return <Icon color={isDone ? Colors.primary[500] : '#afafaf'} />;
};
export default CheckIcon;
