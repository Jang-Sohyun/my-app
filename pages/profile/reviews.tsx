import ScreenBox from 'components/ScreenBox';
import BasicAppBar from 'components/common/BasicAppBar';
import ReviewList from 'components/ReviewList';
import { useDdleContext } from 'contexts/Ddle';

const Review = () => {
  // get loggined user
  const { user } = useDdleContext();
  return (
    <ScreenBox>
      <BasicAppBar title="감상평" />
      {user && <ReviewList profile={user} />}
    </ScreenBox>
  );
};

export default Review;
