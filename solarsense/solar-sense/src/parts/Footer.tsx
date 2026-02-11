import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <footer className="inset-x-0 bottom-0 bg-grayBg">
      <div className="container flex justify-between p-4">
        <select
          id="language"
          onChange={(e) => changeLanguage(e.target.value)}
          value={i18n.language}
          className="block rounded-md bg-grayBg p-2 text-white shadow-sm focus:outline-none sm:text-sm"
        >
          <option value="en">English</option>
          <option value="pl">Polski</option>
        </select>

        <div className="flex items-center gap-2 text-white">
          <a
            href="https://karolfaltyn.github.io"
            target="_blank"
            className="flex gap-2"
          >
            <p className="font-light tracking-wider"> {t("footer.author")}</p>
            <p className="">|</p>
            <p className="tracking-wider">KF</p>
          </a>
        </div>
      </div>
    </footer>
  );
};
