import { useState, useEffect } from "react";
import { useUserContext } from "../../provider/UserProvider";
import { createNote, getNotes, deleteNote } from "./api";
import { Container, Input, Button, NoteCard, Text, Title } from "./styled";
import { FaRegHeart } from 'react-icons/fa';

const Expresate = () => {
  const { user } = useUserContext();
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (user) getNotes(user.uid).then(setNotes);
  }, [user]);

  const updateList = () => {
    if (user) getNotes(user.uid).then(setNotes);
  };

  const handleSubmit = async () => {
    const emojiAndTextRegex = /^[\p{L}\p{Emoji}\s.,!?¡¿'"-]+$/u;
    if (!emojiAndTextRegex.test(note)) return alert("Solo se permite texto y emojis");
    await createNote(user.uid, { note });
    setNote("");
    updateList();
  };

  const handleDelete = async (id) => {
    await deleteNote(user.uid, id);
    updateList();
  };

  return (
    <Container $direction="column">
      <Title><FaRegHeart /> No estas sola en esto  <FaRegHeart /></Title>

      {notes.map((item) => (
        <NoteCard key={item.id}>
          <Text>{item.note}</Text>
          <Button onClick={() => handleDelete(item.id)}>Eliminar</Button>
        </NoteCard>
      ))}

      <Container>
        <Input
          type="text"
          placeholder="Deja tu pensamiento ❤️"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button onClick={handleSubmit}>Enviar</Button>
      </Container>
    </Container>
  );
};

export default Expresate;
