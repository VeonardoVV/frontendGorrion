import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NavBar_1.module.css";


import casa from "../../../../assets/img/309113.svg";

const NavBar_1 = () => (
  <div className={styles.navbar}>
    
    <Link to="/Home"><img src={casa} alt="casa" width={50} /></Link>
    <div>
        <h2>Editor de la Pagina Gorrioncito </h2>
    </div>
    <div className={styles.button}>
        <button>
            Monitor
        </button>
        <button>
            Tablet
        </button>
        <button>
            Ce
        </button>
    </div>
  </div>
);

export default NavBar_1;