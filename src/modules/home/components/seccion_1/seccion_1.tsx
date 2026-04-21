import { useEffect, useState } from "react";
import styles from "./seccion_1.module.css";
import { supabase } from "../../../../app/services/apiSupabase";

const Seccion_1 = () => {

  return (
    <div className={styles.seccion}>
      <p className={styles.titulo}>Gestión de Productos</p>
      <div className={styles.button}>
        {/* <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button> */}
       
      </div>
    </div>  
  );
};

export default Seccion_1;
