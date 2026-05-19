import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {

    axios.get("http://127.0.0.1:8000/api/mensaje")
      .then(response => {
        setMensaje(response.data.mensaje);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  return (
    <div>
      <h1>{mensaje}</h1>
    </div>
  );
}

export default App;