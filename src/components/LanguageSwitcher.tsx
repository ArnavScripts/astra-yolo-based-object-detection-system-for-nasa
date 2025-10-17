import { Languages } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLanguage } from "../utils/languageContext";
import { motion } from "framer-motion";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-slate-800/50 border-blue-500/30 text-slate-200 hover:bg-slate-700/50 hover:border-blue-500/50"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages.find((l) => l.code === language)?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-slate-900 border-blue-500/30"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as "en" | "hi")}
            className={`cursor-pointer ${
              language === lang.code
                ? "bg-blue-600/20 text-blue-300"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 w-full"
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-blue-400">✓</span>
              )}
            </motion.div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
