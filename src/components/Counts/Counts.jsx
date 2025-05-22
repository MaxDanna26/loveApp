import { useState, useEffect } from 'react';
import { useUserContext } from "../../provider/UserProvider";
import { createExpense, getExpenses } from "./api";
import { Button, Container, Input, CountCard } from "./styled";
import PopUp from './PopUp/PopUp';
import CountContent from './CountContent';
import { FaRegHeart } from 'react-icons/fa';
import { Title } from '../Plans/styled';

const Counts = () => {
  const { user } = useUserContext();
  const [expense, setExpense] = useState();

  const [selectedGasto, setSelectedGasto] = useState();
  const [date, setDate] = useState('');
  const [gasto, setGasto] = useState('');
  const [price, setPrice] = useState('');

  const [visible, setVisible] = useState(false);
  const [countId, setCountId] = useState(null);

  useEffect(() => { if (user) { getExpenses(user.uid).then(setExpense) } }, [user]);

  const updateList = () => { if (user) { getExpenses(user.uid).then(setExpense) } };

  const handleEdit = (gasto) => {
    setVisible(true);
    setSelectedGasto(gasto);
    setCountId(gasto.id);
  };

  return (
    <Container $direction='column'>
      <Title>No te quedes con el gasto <FaRegHeart /></Title>

      <Container $direction='column'>
        {expense?.map((gasto, index) => (
          <CountCard $border='1px solid #ED5379;' id={index} key={gasto.id}>
            <CountContent id={gasto.id} content={gasto.gasto} price={gasto.price} date={gasto.date} edit={() => handleEdit(gasto)} reload={() => updateList()} />
          </CountCard>
        ))}

        <Container $margin='1.5rem 0.2rem' $direction='column'>
          <Input type="date" value={date} placeholder="Fecha del gasto" onChange={(e) => setDate(e.target.value)}></Input>
          <Input type="text" value={gasto} placeholder="Tipo de gasto" onChange={(e) => setGasto(e.target.value)} ></Input>
          <Input type="number" value={price} placeholder="Precio del gasto" onChange={(e) => setPrice(e.target.value)}></Input>

          <Button onClick={() => { createExpense(user.uid, { date, gasto, price }); updateList(); }} >Guardar gasto</Button>
        </Container>

        {selectedGasto && (
          <PopUp
            visible={visible}
            setVisible={setVisible}
            countId={countId}
            content={selectedGasto.gasto}
            date={selectedGasto.date}
            price={selectedGasto.price}
            reload={updateList}
          />
        )}
      </Container>
    </Container>
  )
}

export default Counts