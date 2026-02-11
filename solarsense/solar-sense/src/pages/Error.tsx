import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import img_bg from "/assets/images/owl-bg.jpg";

import { useTranslation } from "react-i18next";

export const Error = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <div
        className="flex h-[100%] w-full flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${img_bg})` }}
      >
        <h1 className="py-4 text-5xl font-medium text-darkGray [text-shadow:_0_1px_0_rgb(0_0_0_/_100%)]">
          Oops!
        </h1>
        <p className="text-2xl font-semibold text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_100%)]">
          {t("error.desc")}
        </p>
        <Link to="/">
          <p className="w-64 p-4 font-medium uppercase tracking-widest">
            <Button content={t("error.button")} variant="primary" />
          </p>
        </Link>
      </div>
    </div>
  );
};
