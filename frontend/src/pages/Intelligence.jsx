import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import HubPage from "../components/common/HubPage";

export default function Intelligence() {
  const { language } = useLanguage();
  return <HubPage T={t[language].intelligenceHub} language={language} />;
}
