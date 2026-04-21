import { useState } from "react";

import styles from "./seccion_2.module.css";
import EditNavBar from "./editFG/editNavBar";

const Seccion_2 = () => {
  const [data, setData] = useState("");

  return (
    <div className={styles.seccion}>
      <h1>NavBar:</h1>
      <EditNavBar />
    </div>
  );
};

export default Seccion_2;