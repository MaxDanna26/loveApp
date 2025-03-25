import { useEffect, useState } from "react"
import { createPlan, getPlans } from "./api"
import { useUserContext } from "../../provider/UserProvider";
import { Input, Button, Container, Main, Inputs, Title } from "./styled";
import PopUp from "../PopUp/PopUp";
import PlanContent from "./PlanContent";
import { GlobalStyle } from "../Home/styled.js";
import RandomPlan from "./RandomPlan.jsx";

function Plans() {

  const [msj, setMsj] = useState('');
  const [plans, setPlans] = useState([]);
  const { user } = useUserContext();

  const [visible, setVisible] = useState(false);
  const [editPlan, setEditPlan] = useState('');
  const [planId, setPlanId] = useState(null);

  const updateList = () => { if (user) { getPlans(user.uid).then(setPlans) } };

  useEffect(() => { if (user) { getPlans(user.uid).then(setPlans) } }, [user]);

  const handleEdit = (plan) => {
    setVisible(true);
    setPlanId(plan.id);
    setEditPlan(plan.msj);
  };

  return (
    <Main>
      <GlobalStyle />
      <Title>Plans</Title>

      <Container $direction='column'>
        {plans.map((plan, index) => (
          <Container id={index} $bgColor='#D9CD23' key={plan.id}>
            <PlanContent id={plan.id} content={plan.msj} edit={() => handleEdit(plan)} reload={updateList} />
            <PopUp visible={visible} setVisible={setVisible} planId={planId} content={editPlan} />
          </Container>
        ))}
      </Container>

      <Inputs>
        <Input
          type="text"
          placeholder="Lo que quieras!"
          value={msj}
          onChange={(e) => setMsj(e.target.value)}>
        </Input>
        <Button onClick={async () => { await createPlan(user.uid, { msj }); setMsj(''); updateList(); }} >Guardar</Button>
      </Inputs>

      <RandomPlan plans={plans} />

    </Main>
  )
}

export default Plans
