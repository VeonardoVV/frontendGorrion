import { useState, useEffect } from "react";
import styles from "./seccion_2.module.css";

export default function CarruselEmpresas() {

  // CHECK STATES
  const [checkElectricidad, setCheckElectricidad] = useState(false);
  const [checkCables, setCheckCables] = useState(false);
  const [checkCUC1, setCheckCUC1] = useState(false);
  const [checkCUC2, setCheckCUC2] = useState(false);

  // OPEN STATES
  const [openElectricidad, setOpenElectricidad] = useState(true);
  const [openCables, setOpenCables] = useState(true);

  // --- LÓGICA DE CONTROLADORES (HANDLERS) ---

  // 1. Cuando cambia ELECTRICIDAD (Nivel 1 - Padre Supremo)
  const handleElectricidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setCheckElectricidad(isChecked);
    
    // Cascada hacia abajo: Marcar/Desmarcar TODO
    setCheckCables(isChecked);
    setCheckCUC1(isChecked);
    setCheckCUC2(isChecked);
  };

  // 2. Cuando cambia CABLES (Nivel 2 - Intermedio)
  const handleCablesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setCheckCables(isChecked);

    if (isChecked) {
      // Si se marca, activamos al padre y a todos los hijos
      setCheckElectricidad(true);
      setCheckCUC1(true);
      setCheckCUC2(true);
    } else {
      // Si se desmarca, desmarcamos a los hijos
      setCheckCUC1(false);
      setCheckCUC2(false);
      
      // Opcional: ¿Debería desmarcarse Electricidad si Cables era el único marcado?
      // Por ahora mantenemos la lógica simple: solo desmarca hijos.
    }
  };

  // 3. Cuando cambia un CUC (Nivel 3 - Nieto)
  // Esta función maneja la lógica individual y la propagación hacia arriba
  const handleCUCChange = (setter: any, isChecked: boolean, otherSiblingState: boolean) => {
    setter(isChecked);

    if (isChecked) {
      // Si marco uno, fuerzo a los padres a marcarse
      setCheckCables(true);
      setCheckElectricidad(true);
    } else {
      // Si desmarco este...
      // Verificamos si el "hermano" también está desmarcado. 
      // Si AMBOS están desmarcados, podríamos desmarcar "Cables".
      if (!otherSiblingState) {
         setCheckCables(false);
         // Nota: Normalmente aquí también verificarías si hay otros hermanos de "Cables" 
         // para desmarcar "Electricidad", pero con esta estructura simple, así funciona bien.
      }
    }
  };

  // Efecto opcional: Verificar consistencia (si todos los hijos se desmarcan manualmente, desmarcar padres)
  useEffect(() => {
    if (!checkCUC1 && !checkCUC2 && checkCables) {
        setCheckCables(false);
    }
    // Si quisieras que Electricidad se apague cuando Cables se apaga:
    // if (!checkCables && checkElectricidad) setCheckElectricidad(false); 
  }, [checkCUC1, checkCUC2]);


  return (
    <div className={styles.contenido}>
      <div className={styles.categorias}>
        <h3>Categorías</h3>

        <ul>
          <li>
            <span onClick={() => setOpenElectricidad(!openElectricidad)} style={{cursor: 'pointer', marginRight: '5px'}}>
              {openElectricidad ? "▼" : "▶"}
            </span>

            <input
              type="checkbox"
              checked={checkElectricidad}
              onChange={handleElectricidadChange}
            />
            <label>Electricidad</label>
          </li>

          {openElectricidad && (
            <ul style={{ paddingLeft: "20px" }}>

              <li>
                <span onClick={() => setOpenCables(!openCables)} style={{cursor: 'pointer', marginRight: '5px'}}>
                  {openCables ? "▼" : "▶"}
                </span>

                <input
                  type="checkbox"
                  checked={checkCables}
                  onChange={handleCablesChange}
                />
                <label>Cables</label>
              </li>

              {openCables && (
                <ul style={{ paddingLeft: "20px" }}>

                  <li>
                    <input
                      type="checkbox"
                      checked={checkCUC1}
                      onChange={(e) =>
                        handleCUCChange(setCheckCUC1, e.target.checked, checkCUC2)
                      }
                    />
                    CUC 1
                  </li>

                  {/* NIVEL 3: CUC 2 */}
                  <li>
                    <input
                      type="checkbox"
                      checked={checkCUC2}
                      onChange={(e) =>
                        handleCUCChange(setCheckCUC2, e.target.checked, checkCUC1)
                      }
                    />
                    CUC 2
                  </li>
                </ul>
              )}

            </ul>
          )}
        </ul>
        <p>Mostrar más</p>
      </div>
      {/* marcassssssssssssssssssss */}
      <div className={styles.marcas}>
        <h3>Categorías</h3>

        <ul>
          <li>
            <span onClick={() => setOpenElectricidad(!openElectricidad)} style={{cursor: 'pointer', marginRight: '5px'}}>
              {openElectricidad ? "▼" : "▶"}
            </span>

            <input
              type="checkbox"
              checked={checkElectricidad}
              onChange={handleElectricidadChange}
            />
            <label>Electricidad</label>
          </li>

          {openElectricidad && (
            <ul style={{ paddingLeft: "20px" }}>

              <li>
                <span onClick={() => setOpenCables(!openCables)} style={{cursor: 'pointer', marginRight: '5px'}}>
                  {openCables ? "▼" : "▶"}
                </span>

                <input
                  type="checkbox"
                  checked={checkCables}
                  onChange={handleCablesChange}
                />
                <label>Cables</label>
              </li>

              {openCables && (
                <ul style={{ paddingLeft: "20px" }}>

                  <li>
                    <input
                      type="checkbox"
                      checked={checkCUC1}
                      onChange={(e) =>
                        handleCUCChange(setCheckCUC1, e.target.checked, checkCUC2)
                      }
                    />
                    CUC 1
                  </li>

                  {/* NIVEL 3: CUC 2 */}
                  <li>
                    <input
                      type="checkbox"
                      checked={checkCUC2}
                      onChange={(e) =>
                        handleCUCChange(setCheckCUC2, e.target.checked, checkCUC1)
                      }
                    />
                    CUC 2
                  </li>
                </ul>
              )}

            </ul>
          )}
        </ul>
        <p>Mostrar más</p>
      </div>
    </div>
  );
}