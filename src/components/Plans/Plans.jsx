import { useEffect, useState } from "react"
import { createPlan, getPlans } from "./api"
import { useUserContext } from "../../provider/UserProvider";
import { Input, Button, Container, Main, Inputs, Title, PlanCard } from './styled';
import PopUp from "../PopUp/PopUp.jsx";
import PlanContent from "./PlanContent";
import { FaRegHeart } from "react-icons/fa";
import RandomPlan from "./RandomPlan.jsx";

function Plans() {

  const [msj, setMsj] = useState('');
  const [plans, setPlans] = useState([]);
  const { user } = useUserContext();

  const [visible, setVisible] = useState(false);
  const [editPlan, setEditPlan] = useState('');
  const [planId, setPlanId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);


  const updateList = () => { if (user) { getPlans(user.uid).then(setPlans) } };

  useEffect(() => { if (user) { getPlans(user.uid).then(setPlans) } }, [user]);

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setPlanId(plan.id);
    setEditPlan(plan.msj);
    setVisible(true);
  };

  return (
    <Main>
      <Container>
        <Title>Nuestros planes <FaRegHeart /></Title>
        <RandomPlan plans={plans} />
      </Container>

      <Container $direction='column'>
        {plans.map((plan, index) => (
          <PlanCard id={index} $border='1px solid #ED5379;' key={plan.id}>
            <PlanContent id={plan.id} content={plan.msj} edit={() => handleEdit(plan)} reload={updateList} />
          </PlanCard>
        ))}

        {selectedPlan && (
          <PopUp
            visible={visible}
            setVisible={(v) => {
              setVisible(v);
              if (!v) setSelectedPlan(null);
            }}
            planId={planId}
            content={selectedPlan.msj}
            updateList={updateList}
          />
        )}
      </Container>

      <Inputs>
        <Input
          type="text"
          placeholder="El plan que quieras!"
          value={msj}
          onChange={(e) => setMsj(e.target.value)}>
        </Input>

        <Button onClick={async () => { await createPlan(user.uid, { msj }); setMsj(''); updateList(); }} >Guardar</Button>
      </Inputs>

    </Main>
  )
}

export default Plans
