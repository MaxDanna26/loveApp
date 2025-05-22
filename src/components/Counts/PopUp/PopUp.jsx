import { Back, Overlay, CloseButton, Button, Input, IconStyled, Container } from './styled';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../../provider/UserProvider';
import { updateExpense } from '../../Counts/api';

const PopUp = ({ visible, setVisible, countId, content, date, price, reload }) => {
  const { user } = useUserContext();

  const [gasto, setGasto] = useState(content);
  const [fecha, setFecha] = useState(date);
  const [precio, setPrecio] = useState(price);

  useEffect(() => {
    if (visible) {
      setGasto(content);
      setFecha(date);
      setPrecio(price);
    }
  }, [visible, content, date, price]);

  const handleSave = async () => {
    await updateExpense(user.uid, countId, { gasto, date: fecha, price: precio });
    reload();
    setVisible(false);
  };

  return (
    <Overlay $visible={visible} onClick={() => setVisible(false)}>
      <Back onClick={(e) => e.stopPropagation()}>
        <Container>
          <CloseButton onClick={() => setVisible(false)}>&times;</CloseButton>
          <Input value={gasto} onChange={(e) => setGasto(e.target.value)} />
          <Input value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <Input value={precio} onChange={(e) => setPrecio(e.target.value)} />
          <Button $bg='white' onClick={handleSave}>
            <IconStyled color='black' />
          </Button>
        </Container>
      </Back>
    </Overlay>
  );
};

PopUp.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  countId: PropTypes.string,
  content: PropTypes.string,
  date: PropTypes.string,
  price: PropTypes.string,
  reload: PropTypes.func,
};

export default PopUp;
