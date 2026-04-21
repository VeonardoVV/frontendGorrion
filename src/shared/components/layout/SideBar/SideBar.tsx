import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SideBar.module.css";

type SidebarProps = {
  setView: (view: string) => void;
};

const Sidebar = ({ setView }: SidebarProps) => {
  const [openTestimonios, setOpenTestimonios] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      {/* <div
        className={styles.item}
        onClick={() => navigate("/ferreteria")}
      >
        Ferreteria Gorrion
      </div> */}

      <div
        className={styles.item}
        onClick={() => navigate("/bannerferreteria")}
      >
        Banner
      </div>

      <div
        className={styles.item}
        onClick={() => navigate("/logoferreteria")}
      >
        Logo
      </div>

      <div 
      className={styles.item}
        onClick={() => navigate("/testimonioferreteria")}
      >
        Testimonios
      </div>

      
    </div>
  );
};

export default Sidebar;