import { ArrowCircleUpIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useUpdateCheck, handleUpdateClick } from "@/utils/updateUtils";

interface UpdateButtonProps {
  expanded: boolean;
  onClick?: () => void;
  active?: boolean;
}

export const UpdateButton = ({
  expanded,
  onClick,
  active = false,
}: UpdateButtonProps) => {
  const updateAvailable = useUpdateCheck();

  return (
    <motion.button
      whileHover="hover"
      initial={{
        paddingInline: expanded ? "0px" : "0px",
        fontSize: expanded ? "14px" : "14px",
      }}
      animate={{
        paddingInline: expanded ? "0px" : "0px",
        fontSize: expanded ? "14px" : "14px",
      }}
      onClick={() => {
        onClick?.();
        handleUpdateClick();
      }}
      className={`w-full shrink-0 group h-[44px] flex items-center overflow-hidden rounded-lg cursor-pointer flex-nowrap whitespace-nowrap font-medium duration-100 relative ${
        updateAvailable && expanded
          ? "dark:bg-red-500/90 dark:text-white dark:hover:bg-red-600 animate-pulse"
          : `dark:bg-zinc-800/20 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors dark:text-zinc-400 ${
              active && "dark:!bg-zinc-800 dark:!text-white"
            }`
      }`}
    >
      <motion.div
        animate={{
          fontSize: expanded ? "14px" : "20px",
        }}
        className="h-full aspect-square flex items-center justify-center shrink-0 relative"
      >
        <motion.div
          variants={{
            hover: {
              y: -2,
            },
          }}
          transition={{ duration: 0.2, ease: "easeInOut", type: "tween" }}
        >
          <ArrowCircleUpIcon className="" />
        </motion.div>
        {updateAvailable && !expanded && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          >
            <div className="w-full h-full bg-red-500 rounded-full animate-ping" />
          </motion.div>
        )}
      </motion.div>
      <motion.div
        className="min-w-fit w-full pr-4 text-left"
        animate={{ opacity: !expanded ? 0 : 1 }}
      >
        {expanded
          ? updateAvailable
            ? "Update available"
            : "No updates available"
          : "Updates"}
      </motion.div>
    </motion.button>
  );
};
