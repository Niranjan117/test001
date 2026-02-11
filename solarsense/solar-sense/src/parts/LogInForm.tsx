import { useState, useEffect } from "react";
import { useApiContext } from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "../components/radix/Input";
import { Button } from "../components/Button";

export const LogInForm = () => {
  const { data, error, fetchData } = useApiContext();
  const [tokenId, setTokenId] = useState("");
  const [sn, setSn] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFetchData = async () => {
    if (tokenId && sn) {
      try {
        await fetchData(tokenId, sn);
        setIsClicked(true);
      } catch (err) {
        console.error("Fetch data error:", err);
        setFetchError(t("errorCode.1"));
        setIsClicked(false);
      }
    }
  };

  useEffect(() => {
    if (isClicked && data?.success) {
      navigate("/production");
    }
  }, [isClicked, data, navigate]);

  return (
    <div className="flex w-[90vw] flex-col xs:w-96">
      <div className="my-8 flex flex-col gap-2 rounded-md bg-background p-8 shadow-md md:mt-16">
        <h1 className="text-2xl font-semibold text-darkGray">
          {t("form.title")}
        </h1>
        <hr />
        <p className="mb-4 text-gray"> {t("form.desc")}</p>

        <div className="flex flex-col items-center gap-10">
          <div className="flex w-full flex-col items-end gap-4">
            <Input
              content="TokenID"
              id="tokenId"
              value={tokenId}
              placeholder={t("form.placeholder")}
              onChange={(e) => setTokenId(e.target.value)}
            />

            <Input
              content="SN"
              id="sn"
              value={sn}
              placeholder={t("form.placeholder2")}
              onChange={(e) => setSn(e.target.value)}
            />
          </div>

          <Button
            content={t("form.button")}
            variant="primary"
            onClick={handleFetchData}
          />
        </div>

        {error && <p className="text-center text-red">{error}</p>}
        {fetchError && <p className="text-center text-red">{fetchError}</p>}
      </div>
    </div>
  );
};
