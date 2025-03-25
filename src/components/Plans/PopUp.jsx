import { Back, Overlay, CloseButton, Container, Title } from './styled';
import PropTypes from 'prop-types';

const PopUp = ({ visible, setVisible, planRandom }) => {

  return (
    <Overlay $visible={visible} onClick={() => setVisible(false)}>
      <Back onClick={(e) => e.stopPropagation()}>
        <Container $direction='column' >
          <CloseButton onClick={() => setVisible(false)}>&times;</CloseButton>
          <Title>{planRandom}</Title>
        </Container>
      </Back>
    </Overlay>
  );
};

export default PopUp;

PopUp.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  planRandom: PropTypes.string,
};
