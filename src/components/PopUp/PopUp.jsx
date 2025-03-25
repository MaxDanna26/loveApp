import { Back, Overlay, CloseButton, Button, Input, IconStyled, Container } from './styled';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../provider/UserProvider';
import { updateItem } from '../Plans/api';

const PopUp = ({ visible, setVisible, planId, content, updateList }) => {
  const [editData, setEditData] = useState(content);
  const { user } = useUserContext();

  useEffect(() => {
    if (visible) {
      setEditData(content);
    }
  }, [visible, content]);

  const handleSave = async () => {
    await updateItem(user.uid, planId, { msj: editData });
    updateList;
    setVisible(false);
  };

  return (
    <Overlay $visible={visible} onClick={() => setVisible(false)}>
      <Back onClick={(e) => e.stopPropagation()}>
        <Container >
          <CloseButton onClick={() => setVisible(false)}>&times;</CloseButton>
          <Input value={editData} onChange={(e) => setEditData(e.target.value)} />
          <Button $bg='white' onClick={handleSave}>
            <IconStyled color='black' />
          </Button>
        </Container>
      </Back>
    </Overlay>
  );
};

export default PopUp;

PopUp.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  planId: PropTypes.string,
  content: PropTypes.string,
  updateList: PropTypes.func,
};
