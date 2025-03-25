import { Button, Container } from './styled';
import { useState } from 'react';
import PropTypes from 'prop-types'
import PopUp from './PopUp';

const RandomPlan = ({ plans }) => {
  const [planRandom, setPlanRandom] = useState('');
  const [visible, setVisible] = useState(false);

  const handleRandom = () => {
    if (plans.length > 0) {
      const randomIndex = Math.floor(Math.random() * plans.length);
      setPlanRandom(plans[randomIndex].msj);
      setVisible(true);
    }
  };

  return (
    <Container>
      <Container>
        <Button onClick={() => handleRandom()}>Plan random</Button>
        <PopUp visible={visible} setVisible={setVisible} planRandom={planRandom} />
      </Container>
    </Container>
  )
}

export default RandomPlan

RandomPlan.propTypes = {
  plans: PropTypes.array,
}
