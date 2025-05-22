import { useUserContext } from '../../provider/UserProvider';
import { FaPencilAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Magic, Like, Container } from './styled';
import { FcLike } from 'react-icons/fc';
import { deleteExpense } from './api';

const CountContent = ({ id, content, price, date, reload, edit }) => {
  const { user } = useUserContext();

  return (
    <Container>
      <Magic><strong>{date}</strong> - {content} - {price} €</Magic>
      <Like onClick={async () => {
        await deleteExpense(user.uid, id);
        reload();
      }}>
        <FcLike size='25px' />
      </Like>
      <Like onClick={edit}>
        <FaPencilAlt size='25px' />
      </Like>
    </Container>
  );
};

export default CountContent;

CountContent.propTypes = {
  reload: PropTypes.func,
  edit: PropTypes.func,
  id: PropTypes.string,
  content: PropTypes.string,
  price: PropTypes.string,
  date: PropTypes.string,
};
