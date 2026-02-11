import { useState, useEffect } from "react";
import { DataGrid } from "../parts/DataGrid";
import { DataInfo } from "../parts/DataInfo";

export const Production = () => {
  const [showComponents, setShowComponents] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponents(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container my-8 max-w-[1000px]">
      {!showComponents ? (
        <div className="flex h-full items-center justify-center">
          <img
            src="./assets/images/loading.gif"
            alt="Loading..."
            className="h-16 w-16"
          />
        </div>
      ) : (
        <>
          <DataGrid />
          <DataInfo />
        </>
      )}
    </div>
  );
};
