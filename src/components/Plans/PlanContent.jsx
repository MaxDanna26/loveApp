import { useUserContext } from '../../provider/UserProvider';
import { FaPencilAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { deletePlan } from './api';
import { Magic, Like, Container } from './styled';
import { FcLike } from 'react-icons/fc';

const PlanContent = ({ id, content, reload, edit }) => {
  const { user } = useUserContext();

  return (
    <Container>
      <Like onClick={async () => {
        await deletePlan(user.uid, id);
        reload();
      }}>
        <FcLike size='25px' />
      </Like>
      <Magic>{content}</Magic>
      <Like onClick={edit}>
        <FaPencilAlt size='25px' />
      </Like>
    </Container>
  );
};

export default PlanContent;

PlanContent.propTypes = {
  reload: PropTypes.func,
  edit: PropTypes.func,
  id: PropTypes.string,
  content: PropTypes.string,
};
