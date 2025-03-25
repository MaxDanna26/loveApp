import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./services/firebase.js"
import Router from "./services/Router"
import { useUserContext } from "./provider/UserProvider";
import Login from "./components/Login/Login.jsx";

const App = () => {
  const { user, setUser } = useUserContext();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log('user', user, ' userId:', user.uid);
        setUser(user);
      } else {
        console.log("No user logged");
        setUser(null);
      }
    });
  }, [setUser]);

  return user ? <Router /> : <Login />
}

export default App