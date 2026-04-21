import { useState } from "react";
import styles from "./seccion_1.module.css";

const logos = [
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
  "https://d9pq5ako66lc4.cloudfront.net/brands/Sika.png",
];

export default function CarruselEmpresas() {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % logos.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + logos.length) % logos.length);
  };

  return (
    <div className={styles.carruselWrapper}>
      <button className={styles.leftArrow} onClick={prev}>{"<"}</button>
      <div className={styles.carruselViewport}>
        <div
          className={styles.carruselTrack}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {logos.map((logo, i) => (
            <div key={i} className={styles.logoContainer}>
              <img src={logo} alt={`logo ${i}`} />
            </div>
          ))}
        </div>
      </div>
      <button className={styles.rightArrow} onClick={next}>{">"}</button>
    </div>
  );
}