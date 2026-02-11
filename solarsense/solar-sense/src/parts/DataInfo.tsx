import { useTranslation } from "react-i18next";

export const DataInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-16 ">
      <h1 className="font-semibold text-darkGray">{t("production.info")}</h1>
      <p className="text-gray">{t("production.extraInfo")}</p>
    </div>
  );
};
