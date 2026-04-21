import { useEffect, useState } from "react";
import styles from "./editNavBar.module.css";
import { supabase } from "../../../../../lib/supabase";

const EditNavBar = () => {

  // ✅ PRIMERO los estados
  const [tipo, setTipo] = useState("");
  const [colorNormal, setColorNormal] = useState("#ffffff");
  const [colorScroll, setColorScroll] = useState("#000000");

  const [alphaNormal, setAlphaNormal] = useState(1);
  const [alphaScroll, setAlphaScroll] = useState(1);

  const [gradiente, setGradiente] = useState({
    normal:{
      left: "#000000",
      right: "#ffffff",
      alpha: 1
    },
    scroll: {
      left: "#111111",
      right: "#999999",
      alpha: 1
    }
  });

  // ✅ DESPUÉS el useEffect
  useEffect(() => {
    const obtenerDatos = async () => {
      const { data, error } = await supabase
        .from("tu_tabla")
        .select("color, gradiente")
        .single();

      if (data) {
        if (data.color === true) {
          setTipo("color");
        } else if (data.gradiente === true) {
          setTipo("gradiente");
        }
      }
    };

    obtenerDatos();
  }, []);
const dataToSave = {
  navbar: {
    background: {
      normal: {
        color: colorNormal,
        alpha: alphaNormal
      },
      scroll: {
        color: colorScroll,
        alpha: alphaScroll
      },
      gradiente: gradiente
    }
  }
};
const guardarCambios = async () => {
  const css = {
    navbar: {
      background: {
        normal: {
          color: colorNormal,
          alpha: alphaNormal
        },
        scroll: {
          color: colorScroll,
          alpha: alphaScroll
        },
        gradiente: gradiente
      }
    }
  };

  const { error } = await supabase
    .from("navbar")
    .update({
      css: css // ✅ SIN stringify
    })
    .eq("nb_id", 1);

  if (error) {
    console.error("Error guardando:", error);
  } else {
    console.log("Guardado correctamente 🔥");
  }
};
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

const backgroundNormal = hexToRgba(colorNormal, alphaNormal);
const backgroundScroll = hexToRgba(colorScroll, alphaScroll);

  const gradientNormal = `linear-gradient(
    to right,
    ${hexToRgba(gradiente.normal.left, gradiente.normal.alpha)},
    ${hexToRgba(gradiente.normal.right, gradiente.normal.alpha)}
  )`;
    const gradientScroll = `linear-gradient(
    to right,
    ${hexToRgba(gradiente.scroll.left, gradiente.scroll.alpha)},
    ${hexToRgba(gradiente.scroll.right, gradiente.scroll.alpha)}
  )`;
    
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <div className={styles.seccion}>
      
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="color">Color</option>
        <option value="gradiente">Gradiente</option>
      </select>

      {/* COLOR */}
      {tipo === "color" && (
        <div>
          <input 
            type="color" 
            value={colorNormal}
            onChange={(e) => setColorNormal(e.target.value)}
          />

          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={alphaNormal}
            onChange={(e) => setAlphaNormal(Number(e.target.value))}
          />
        </div>
      )}

      {/* GRADIENTE */}
      {tipo === "gradiente" && (
        <div>
            <input 
            type="color"
            value={gradiente.normal.left}
            onChange={(e) =>
                setGradiente({
                ...gradiente,
                normal:{
                    ...gradiente.normal,
                    left: e.target.value 
                }
                })
            }
            />

            <input 
            type="color"
            value={gradiente.normal.right}
            onChange={(e) =>
                setGradiente({ 
                ...gradiente, 
                normal:{
                    ...gradiente.normal,
                    right: e.target.value 
                }
                })
            }
            />

            <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={gradiente.normal.alpha}
            onChange={(e) =>
                setGradiente({
                ...gradiente,
                normal: {
                    ...gradiente.normal,
                    alpha: Number(e.target.value)
                }
                })
            }
            />
          
        </div>
      )}

      {/* 🔥 PREVIEW (IMPORTANTE) */}
      <div
        style={{
          marginTop: "10px",
          height: "60px",
          background:
            tipo === "color" ? backgroundNormal : gradientNormal
        }}
      >
        
      </div>

      <p>
        {tipo === "color" && "Color Seleccionado"}
        {tipo === "gradiente" && "gradiente Seleccionado"}
      </p>
      {/* COLOR */}
      {tipo === "color" && (
        <div>
          <input 
            type="color" 
            value={colorScroll}
            onChange={(e) => setColorScroll(e.target.value)}
          />

          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={alphaScroll}
            onChange={(e) => setAlphaScroll(Number(e.target.value))}
          />
        </div>
      )}

      {/* GRADIENTE */}
      {tipo === "gradiente" && (
        <div>
            <input 
            type="color"
            value={gradiente.scroll.left}
            onChange={(e) =>
                setGradiente({
                ...gradiente,
                scroll:{
                    ...gradiente.scroll,
                    left: e.target.value 
                }
                })
            }
            />

            <input 
            type="color"
            value={gradiente.scroll.right}
            onChange={(e) =>
                setGradiente({ 
                ...gradiente, 
                scroll:{
                    ...gradiente.scroll,
                    right: e.target.value 
                }
                })
            }
            />

            <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={gradiente.scroll.alpha}
            onChange={(e) =>
                setGradiente({
                ...gradiente,
                scroll: {
                    ...gradiente.scroll,
                    alpha: Number(e.target.value)
                }
                })
            }
            />
          
        </div>
      )}

      {/* 🔥 PREVIEW (IMPORTANTE) */}
      <div
        style={{
          marginTop: "10px",
          height: "60px",
          background:
            tipo === "color" ? backgroundScroll : gradientScroll
        }}
      >
        
      </div>
      <button onClick={guardarCambios}>
        Guardar cambios
      </button>
    </div>
  );
};

export default EditNavBar;