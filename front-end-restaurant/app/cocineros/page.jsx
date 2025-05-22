import React from "react";
import { Image } from "primereact/image";

const CocineroPage = () => {
  return (
    <div>
      <Image
        src="https://i.ibb.co/CbKBG0K/Img-Principal.png"
        alt="Imagen"
        width="869px"
        height="437px"
        preview
        style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop:"50px" }}
      />
    </div>
  );
};

export default CocineroPage;
