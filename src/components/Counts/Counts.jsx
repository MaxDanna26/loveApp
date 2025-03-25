import { useState } from "react"
import { useUserContext } from "../../provider/UserProvider";
import { createExpense } from "./api";

const Counts = () => {
  const { user } = useUserContext();
  const [date, setDate] = useState('');
  const [gasto, setGasto] = useState('');
  const [price, setPrice] = useState('');

  return (
    <div>
      <input type="date" value={date} placeholder="Fecha del gasto" onChange={(e) => setDate(e.target.value)}></input>
      <input type="text" value={gasto} placeholder="Tipo de gasto" onChange={(e) => setGasto(e.target.value)} ></input>
      <input type="number" value={price} placeholder="Precio del gasto" onChange={(e) => setPrice(e.target.value)}></input>
      <button onClick={() => createExpense(user.uid, { date, gasto, price })} >Guardar gasto</button>
    </div>
  )
}

export default Counts