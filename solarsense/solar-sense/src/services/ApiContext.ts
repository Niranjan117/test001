import { createContext, useContext } from "react";
import { ApiDataType } from "../data/api-data-type";

interface ApiContextType {
  data: ApiDataType | null;
  loading: boolean;
  error: string | null;
  fetchData: (tokenId: string, sn: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApiContext = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
};

export default ApiContext;
