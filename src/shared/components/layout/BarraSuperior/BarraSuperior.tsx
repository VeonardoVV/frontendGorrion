import { useEffect, useState } from "react";
import styles from "./BarraSuperior.module.css";
import { supabase } from "../../../../app/services/apiSupabase.ts";
import img from "../../../../assets/img/imgAdminPanel.png";
import Modal from "./modal";


// ✅ HOOK DE ANIMACIÓN (FUERA DEL COMPONENTE)
const useCountUp = (value: number, startOffset = 40, duration = 800) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = Math.max(value - startOffset, 0);
    const end = value;

    let current = start;
    setDisplayValue(start);

    if (start === end) return;

    const steps = end - start;
    const incrementTime = Math.max(10, duration / steps);

    const timer = setInterval(() => {
      current += 1;
      setDisplayValue(current);

      if (current >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, startOffset, duration]);

  return displayValue;
};


const Seccion_1 = () => {
  // 📊 estados de datos
  const [cantidadTotalProducto, setCantidadTotalProducto] = useState(0);
  const [cantidadTotalCategoria, setCantidadTotalCategoria] = useState(0);
  const [cantidadTotalMarca, setCantidadTotalMarca] = useState(0);

  // 🎬 modal state
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"producto" | "categoria" | "marca" | null>(null);

  // 🚀 función abrir modal
  const handleOpenModal = (type: "producto" | "categoria" | "marca") => {
    setModalType(type);
    setOpenModal(true);
  };


  // 🎯 animaciones
  const productoAnimado = useCountUp(cantidadTotalProducto);
  const categoriaAnimado = useCountUp(cantidadTotalCategoria);
  const marcaAnimado = useCountUp(cantidadTotalMarca);


  // 🔌 fetch supabase
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { count: p } = await supabase
          .from("producto")
          .select("*", { count: "exact" });

        const { count: c } = await supabase
          .from("categoria")
          .select("*", { count: "exact" });

        const { count: m } = await supabase
          .from("marca")
          .select("*", { count: "exact" });

        setCantidadTotalProducto(p || 0);
        setCantidadTotalCategoria(c || 0);
        setCantidadTotalMarca(m || 0);

      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCounts();
  }, []);

  
  return (
    <div className={styles.seccion}>
      <div className={styles.imagenPanel}>
        <img src={img} alt="Panel Admin" />
      </div>

      <div className={styles.PCM}>

        {/* PRODUCTOS */}
        <div className={styles.PCM1} onClick={() => handleOpenModal("producto")}>
          <div className={styles.cardLeft}>
            <span>PRODUCTOS</span>
          </div>
          <div className={styles.cardNumber}>
            {productoAnimado}
          </div>
        </div>

        {/* CATEGORIAS */}
        <div className={styles.PCM2} onClick={() => handleOpenModal("categoria")}>
          <div className={styles.cardLeft}>
            <span>CATEGORIAS</span>
          </div>
          <div className={styles.cardNumber}>
            {categoriaAnimado}
          </div>
        </div>

        {/* MARCAS */}
        <div className={styles.PCM3} onClick={() => handleOpenModal("marca")}>
          <div className={styles.cardLeft}>
            <span>MARCAS</span>
          </div>
          <div className={styles.cardNumber}>
            {marcaAnimado}
          </div>
        </div>

      </div>

      {/* ✅ MODAL */}
      {openModal && (
        <Modal
          type={modalType}
          onClose={() => setOpenModal(false)}
        />
      )}

    </div>
  );
};

export default Seccion_1;