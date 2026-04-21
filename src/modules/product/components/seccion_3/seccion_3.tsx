import styles from "./seccion_3.module.css";
import img7 from "../../../../assets/img/0.jpg";

export default function CarruselEmpresas() {

  const categoria = "Bosch";
  const nombre = "Máquina de 5000 pesos 100% calidad";
  const boton = <button className={styles.botonAgregar}>AGREGAR</button>;

  return (
    <div className={styles.contenido}>
      <div className={styles.card}>
        <div className={styles.img}>
          <img src={img7} alt="producto" />
        </div>
        <div className={styles.colorLinea}>_______________________________________________________________</div>
        <div className={styles.abajoCarda}>
          <h3>{categoria}</h3>
          <p>{nombre}</p>
          {boton}
        </div>
      </div>
    </div>
  );
}