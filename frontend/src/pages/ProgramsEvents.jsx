import { useLanguage } from "../lib/LanguageContext";
import { t } from "../lib/translations";
import HubPage from "../components/common/HubPage";

export default function ProgramsEvents() {
  const { language } = useLanguage();
  return <HubPage T={t[language].programsEventsHub} language={language} />;
}
