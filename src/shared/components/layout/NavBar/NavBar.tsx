import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import NavBarModal from "./NavBarModalProducto/NavBarModalProducto";


export default function NavBar() {
  const [clickAnim, setClickAnim] = useState(false); // para que cuando clickee el boton de Iniciar Sesion me salga la animaion del borde
  const handleLoginClick = () => {
    const [modalOpen, setModalOpen] = useState(false);
const [modalType, setModalType] = useState<"producto" | "categoria" | "marca" | null>(null);
const openModal = (type: "producto" | "categoria" | "marca") => {
  setModalType(type);
  setModalOpen(true);
};
  setShowLoginModal(!showLoginModal);

  setClickAnim(true);

  setTimeout(() => {
    setClickAnim(false);
  }, 1000); // dura 1 segundo
};

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const location = useLocation(); // detecta la ruta actual
  const [showModal, setShowModal] = useState(false); // esto es para mi modal al pasar el mouse por el producto
  useEffect(() => {
    const handleScroll = () => {
      if (
        location.pathname !== "/product" &&
        location.pathname !== "/cart" &&
        location.pathname !== "/Auth"
      ){
        setScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);

    if (
      location.pathname=== "/product" ||
      location.pathname=== "/cart" ||
      location.pathname=== "/Auth"
    ){
      setScrolled(true);
    }else{
      setScrolled(window.scrollY > 50);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <div className="navbar-wrapper">
      <div className={`${styles.navbar} ${scrolled ? styles.active : ""}`}>
        <div className={styles.left}>
          <img
            className={styles.logo}
            src={
              scrolled
                ? img1
                : img1
            }
            alt="logo"
          />
          <Link
            to="/juve"
            className={location.pathname === "/juve" ? styles.activeLink : ""}
          >
            Nosotros
          </Link> 
            <div
              className={styles.productWrapper}
              onMouseEnter={() => setShowModal(true)}
              onMouseLeave={() => setShowModal(false)}
            >
              <Link
                to="/product"
                className={location.pathname === "/product" ? styles.activeLink : ""}
              >
                Productos
              </Link>

              {showModal && <NavBarModal />}
            </div>
          <Link
            to="/juve"
            className={location.pathname === "/juve" ? styles.activeLink : ""}
          >
            Catálogo
          </Link>
        </div>
        <div className={styles.right}>
          <div className={styles.rightIconShop}>
            <Link
              to="/cart"
              className={styles.iconShop}
            >
              <svg
                // onClick={}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                width="25"
                height="25"
                fill="currentColor"
              >
                <path d="M 922.9 701.9 H 327.4 l 29.9 -60.9 l 496.8 -0.9 c 16.8 0 31.2 -12 34.2 -28.6 l 68.8 -385.1 c 1.8 -10.1 -0.9 -20.5 -7.5 -28.4 a 34.99 34.99 0 0 0 -26.6 -12.5 l -632 -2.1 l -5.4 -25.4 c -3.4 -16.2 -18 -28 -34.6 -28 H 96.5 a 35.3 35.3 0 1 0 0 70.6 h 125.9 L 246 312.8 l 58.1 281.3 l -74.8 122.1 a 34.96 34.96 0 0 0 -3 36.8 c 6 11.9 18.1 19.4 31.5 19.4 h 62.8 a 102.43 102.43 0 0 0 -20.6 61.7 c 0 56.6 46 102.6 102.6 102.6 s 102.6 -46 102.6 -102.6 c 0 -22.3 -7.4 -44 -20.6 -61.7 h 161.1 a 102.43 102.43 0 0 0 -20.6 61.7 c 0 56.6 46 102.6 102.6 102.6 s 102.6 -46 102.6 -102.6 c 0 -22.3 -7.4 -44 -20.6 -61.7 H 923 c 19.4 0 35.3 -15.8 35.3 -35.3 a 35.42 35.42 0 0 0 -35.4 -35.2 Z M 305.7 253 l 575.8 1.9 l -56.4 315.8 l -452.3 0.8 L 305.7 253 Z m 96.9 612.7 c -17.4 0 -31.6 -14.2 -31.6 -31.6 c 0 -17.4 14.2 -31.6 31.6 -31.6 s 31.6 14.2 31.6 31.6 a 31.6 31.6 0 0 1 -31.6 31.6 Z m 325.1 0 c -17.4 0 -31.6 -14.2 -31.6 -31.6 c 0 -17.4 14.2 -31.6 31.6 -31.6 s 31.6 14.2 31.6 31.6 a 31.6 31.6 0 0 1 -31.6 31.6 Z"/>
              </svg>
              <span className={styles.cartCount}>0</span>
            </Link>
          </div>
          <button className={styles.right_cotizar}><p>Cotizar</p></button>
        </div>
      </div>
    </div>    
  );
}