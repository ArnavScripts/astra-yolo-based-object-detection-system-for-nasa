import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { Shield, Zap, Target } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "../utils/languageContext";

interface HeaderProps {
  totalDetections?: number;
}

export function Header({ totalDetections = 0 }: HeaderProps) {
  const { t } = useLanguage();
  return (
    <header className="border-b border-blue-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-blue-500/5">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-blue-500 blur-xl opacity-50 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <span className="text-3xl">🚀</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-white">{t.title}</h1>
                <Badge
                  variant="outline"
                  className="border-green-500/50 text-green-300 bg-green-500/10"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {t.live}
                </Badge>
              </div>
              <p className="text-slate-200 text-sm">{t.subtitle}</p>
            </div>
          </motion.div>

          <motion.div
            className="hidden md:flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LanguageSwitcher />
            <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
              <Shield className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <p className="text-slate-200 text-xs">Safety Classes</p>
                <p className="text-white">7 Objects</p>
              </div>
            </div>

            <motion.div
              className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20"
              animate={{
                scale: totalDetections > 0 ? [1, 1.05, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Target className="w-5 h-5 text-green-400" />
              <div className="text-left">
                <p className="text-slate-200 text-xs">Total Detected</p>
                <p className="text-white">{totalDetections}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
