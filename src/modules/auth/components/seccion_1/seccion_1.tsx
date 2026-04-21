import { useState } from "react"; 
import style from "./seccion_1.module.css";
import img1 from "../../../../assets/img/logo_gorrion.png";
import { supabase } from "../../../../app/services/apiSupabase";

const Seccion_1 = () => {
  // estados para inputs
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

  // función de login
  const login = async () => {
    if (!usuario || !clave) {
      alert("Ingresa usuario y contraseña");
      return;
    }

    try {
      // 1. Buscar usuario en tabla
      const { data: usuarioData, error: errorUsuario } = await supabase
        .from("usuario")
        .select("*")
        .eq("nombre", usuario)
        .eq("clave", clave)
        .single(); // devuelve solo 1 usuario

      if (errorUsuario || !usuarioData) {
        alert("Usuario o contraseña incorrectos");
        return;
      }

      // 2. Verificar que tenga al menos un rol
      const { data: rolData, error: errorRol } = await supabase
        .from("rol")
        .select("*")
        .eq("id_usuario", usuarioData.id_usuario);

      if (errorRol) {
        console.log(errorRol);
        alert("Error al verificar roles");
        return;
      }

      if (!rolData || rolData.length === 0) {
        alert("No tienes permisos para ingresar");
        return;
      }

      // 3. Redireccionar a /home
      window.location.href = "/home";

    } catch (error) {
      console.log(error);
      alert("Ocurrió un error");
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.contenido}>
        <div className={style.logo}>
          <img src={img1} alt="logo-no-disponible" />
        </div>
        <br />

        <h3>Iniciar Sesión</h3>


        {/* USUARIO */}
        <div className={style.inputGroup}>
          <svg
            className={style.icon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            width="18"
            height="18"
            fill="currentColor"
          >
            <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"/>
          </svg>

          <input
            className={style.inputUsuario}
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <br />

        {/* CONTRASEÑA */}
        <div className={style.inputGroup}>
          <svg
            className={style.icon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            width="18"
            height="18"
            fill="currentColor"
          >
            <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z"/>
          </svg>

          <input
            className={style.inputUsuario}
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
        </div>
        <br />
        <div className={style.botonIngresar}>
          <button onClick={login}>Ingresar</button>
        </div>
        <br />
        <a href="/">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  );
};

export default Seccion_1;