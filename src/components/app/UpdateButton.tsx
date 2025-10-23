import { ArrowCircleUpIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useUpdateCheck, handleUpdateClick } from "@/utils/updateUtils";
import { emit, listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { SidebarButton } from "./Sidebar";

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
  const [isUpdating, setIsUpdating] = useState(false);

  // Emit update-needed event when update is available
  useEffect(() => {
    if (updateAvailable) {
      console.log(
        "[Main Window] Update available - emitting 'update-needed' to overlay",
      );
      emit("update-needed", { available: true });
    } else {
      console.log(
        "[Main Window] No update available - emitting 'update-needed' to overlay",
      );
      emit("update-needed", { available: false });
    }
  }, [updateAvailable]);

  // Listen for update-now event from overlay
  useEffect(() => {
    const setupListener = async () => {
      const unlisten = await listen("update-now", async () => {
        console.log(
          "[Main Window] Received 'update-now' event from overlay - starting update process",
        );
        setIsUpdating(true);
        try {
          await handleUpdateClick();
        } catch (error) {
          console.error("[Main Window] Update failed:", error);
        } finally {
          setIsUpdating(false);
        }
      });

      return unlisten;
    };

    let unlisten: (() => void) | undefined;
    setupListener().then((unlistenFn) => {
      unlisten = unlistenFn;
    });

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  const handleClick = () => {
    onClick?.();
    if (updateAvailable) {
      console.log(
        "[Main Window] Update button clicked - starting update process",
      );
      handleUpdateClick();
    }
  };

  return (
    <div className="relative">
      <SidebarButton
        active={active}
        expanded={expanded}
        onClick={handleClick}
        logo={
          <motion.div
            variants={{
              hover: {
                // y: -2,
              },
            }}
            transition={{ duration: 0.2, ease: "easeInOut", type: "tween" }}
            className="relative"
          >
            <ArrowCircleUpIcon className={isUpdating ? "animate-spin" : ""} />
            {updateAvailable && !expanded && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
              >
                <div className="w-full h-full bg-red-500 rounded-full animate-ping" />
              </motion.div>
            )}
          </motion.div>
        }
      >
        <span
          className={`${
            updateAvailable && expanded ? "text-red-400 animate-pulse" : ""
          } ${isUpdating ? "opacity-50" : ""}`}
        >
          {expanded
            ? isUpdating
              ? "Updating..."
              : updateAvailable
                ? "Update available"
                : "No updates available"
            : "Updates"}
        </span>
      </SidebarButton>
    </div>
  );
};
