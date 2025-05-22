import { Back, Overlay, CloseButton, Container, TitlePop } from './styled';
import PropTypes from 'prop-types';

const PopUp = ({ visible, setVisible, planRandom }) => {

  return (
    <Overlay $visible={visible} onClick={() => setVisible(false)}>
      <Back onClick={(e) => e.stopPropagation()}>
        <Container $direction='column' >
          <CloseButton onClick={() => setVisible(false)}>&times;</CloseButton>
          <TitlePop>{planRandom}</TitlePop>
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
