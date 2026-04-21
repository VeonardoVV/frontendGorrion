import styles from "./seccion_1.module.css";

const Seccion_1 = ({ vista }) => {

  let width = "100%";
  let height = "400px";

  if (vista === "tablet") {
    width = "768px";
    height = "600px";
  }

  if (vista === "celular") {
    width = "375px";
    height = "667px";
  }

  return (
    <div className={styles.seccion}>
      <div style={{ overflow: "auto" }}>
        <iframe
          src="https://pruebaindex1.vercel.app/"
          style={{
            width: width,
            height: height,
            border: "1px solid #ccc",
            borderRadius: "10px"
          }}
        />
      </div>
    </div>
  );
};

export default Seccion_1;