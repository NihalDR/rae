import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Hardcoded search sites Todo: Implement real time search icons and names to display
const SEARCH_SITES = [
  {
    name: "Google",
    logo: "data:image/svg+xml;base64," + btoa(`
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    `),
  },
  {
    name: "Reddit",
    logo: "data:image/svg+xml;base64," + btoa(`
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ff4500" d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    `),
  },
  {
    name: "Stack Overflow",
    logo: "data:image/svg+xml;base64," + btoa(`
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#f48024" d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM24 22.01H0v-9.534h3.082V19.01H20.918V12.476H24V22.01z"/>
        <path fill="#f48024" d="M6.167 13.262H9.25v5.773H6.167zm4.118 0h3.082v5.773h-3.082z"/>
      </svg>
    `),
  },
  {
    name: "YouTube",
    logo: "data:image/svg+xml;base64," + btoa(`
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ff0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    `),
  },
  {
    name: "GitHub",
    logo: "data:image/svg+xml;base64," + btoa(`
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffffff" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    `),
  },
];

interface WebSearchAnimationProps {
  isSearching: boolean;
}

export const WebSearchAnimation = ({ isSearching }: WebSearchAnimationProps) => {
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  const [searchedSites, setSearchedSites] = useState<typeof SEARCH_SITES>([]);

  useEffect(() => {
    if (!isSearching) {
      setCurrentSiteIndex(0);
      setSearchedSites([]);
      return;
    }

    const interval = setInterval(() => {
      setCurrentSiteIndex((prev) => {
        const nextIndex = (prev + 1) % SEARCH_SITES.length;
        
        // Add the current site to searched sites if not already there
        setSearchedSites((prevSearched) => {
          const currentSite = SEARCH_SITES[prev];
          if (!prevSearched.find(site => site.name === currentSite.name)) {
            return [...prevSearched, currentSite];
          }
          return prevSearched;
        });
        
        return nextIndex;
      });
    }, 800); // Change site every 800ms

    return () => clearInterval(interval);
  }, [isSearching]);

  if (!isSearching) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className="flex flex-col gap-3 mt-2 mx-2 dark:text-zinc-200 font-medium items-start text-sm h-fit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Main Rae logo with searching animation */}
        <div className="flex gap-3 items-center">
          <motion.div
            initial={{ borderRadius: "0%", rotate: "90deg" }}
            animate={{
              borderRadius: ["0%", "50%", "0%"],
              rotate: ["90deg", "180deg", "270deg"],
            }}
            transition={{
              duration: 1,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="self-start flex items-center relative border-[3px] border-surface size-[20px] justify-center"
          ></motion.div>

          <div className="flex flex-col gap-1">
            <div className="animate-pulse font-semibold">Rae is searching...</div>

            {/* Currently searching site */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSiteIndex}
                className="flex items-center gap-2 text-xs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop" }}
                  className="size-4 flex items-center justify-center"
                >
                  <img
                    src={SEARCH_SITES[currentSiteIndex].logo}
                    alt={SEARCH_SITES[currentSiteIndex].name}
                    className="size-full object-contain"
                  />
                </motion.div>
                <span className="text-zinc-400">
                  Searching {SEARCH_SITES[currentSiteIndex].name}...
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};

export default WebSearchAnimation;
