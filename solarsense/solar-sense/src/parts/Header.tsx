import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-md p-4 backdrop-blur-sm">
      <header>
        <h1 className="py-4 text-center font-montserrat text-5xl text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_100%)] md:text-left">
          Solar Sense
        </h1>
      </header>
      <p className="text-wrap font-medium text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_80%)] xs:w-[35ch] sm:w-[40ch] lg:w-[60ch]">
        {t("header.desc")}
        <a
          className="text-darkBlue underline"
          href="https://www.eu.solaxcloud.com/phoebus/resource/files/userGuide/Solax_API_for_End-user_V1.0.pdf"
          target="_blank"
        >
          Solax Cloud Api
        </a>
        <br /> <br />
        {t("header.desc2")}
        <Link to="/demo" className="text-darkGreen underline">
          Demo
        </Link>
      </p>
    </div>
  );
};
