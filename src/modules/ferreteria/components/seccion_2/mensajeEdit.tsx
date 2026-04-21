import { useState } from "react";

import styles from "./mensajeEdit.module.css";


const MensajeEdit = () => {
  const [data, setData] = useState("");

  return (
    <div className={styles.seccion}>
        Estas seguro de que quieres cambiar a {}? los cambios se guardaran
    </div>
  );
};

export default MensajeEdit;