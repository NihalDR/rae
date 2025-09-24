import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import Sidebar from "@/components/app/Sidebar";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition } from "@tauri-apps/api/dpi";
import { AnimatePresence, motion } from "motion/react";
import { currentMonitor, getAllWindows } from "@tauri-apps/api/window";

export default function MainApp() {
  const navigate = useNavigate();

  const [showApp, setShowApp] = useState(false);
  const followFrame = useRef<number | null>(null);
  const following = useRef(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    listen<{to: string}>("navigate_to", async (event) => {
      console.log("triggered unlisten")
      navigate(event.payload.to)
    }).then((fn) => {
      unlisten = fn;
    })

    return ( ) => {
      if (unlisten) unlisten()
    }
  }, [navigate]);

  async function followOverlay() {
    if (!following.current) return;

    try {
      const win = getCurrentWebviewWindow();
      const overlayWindow = (await getAllWindows()).find(
        (w) => w.label === "overlay"
      );
      if (overlayWindow) {
        const overlayPosition = await overlayWindow.outerPosition();
        await win.setPosition(
          new LogicalPosition(
            overlayPosition.x + 240 - 500,
            overlayPosition.y + 60
          )
        );
      }
    } catch (e) {
      console.error("Failed to follow overlay:", e);
    }

    followFrame.current = requestAnimationFrame(followOverlay);
  }

  function startFollowingOverlay() {
    if (!following.current) {
      following.current = true;
      followOverlay();
    }
  }

  function stopFollowingOverlay() {
    following.current = false;
    if (followFrame.current) cancelAnimationFrame(followFrame.current);
  }

  // Handle app navigation
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    listen<{ navigate?: boolean }>("rae:transfer-chat", (event) => {
      if (event?.payload?.navigate) {
        navigate("/app/chat");
      }
    }).then((fn) => {
      unlisten = fn;
    });
    return () => {
      if (unlisten) unlisten();
    };
  }, [navigate]);

  // Listen for overlay show/hide
  useEffect(() => {
  let unlisten: (() => void) | undefined;

  listen<{ show: boolean }>("show_app", async (event) => {
    console.log("triggered");

    try {
      const win = getCurrentWebviewWindow();

      if (event.payload.show) {
        invoke("show_app");
        console.log("showing app");

        // 🔥 First, position window relative to overlay
        const overlayWindow = (await getAllWindows()).find(
          (w) => w.label === "overlay"
        );

        if (overlayWindow) {
          const overlayPosition = await overlayWindow.outerPosition();
          await win.setPosition(
            new LogicalPosition(
              overlayPosition.x + 240 - 500,
              overlayPosition.y + 60
            )
          );
        }

        // Then update state
        setShowApp(true);

        // And only then start following
        await win.setFocus();
        startFollowingOverlay();
      } else {
        invoke("hide_app");
        stopFollowingOverlay();
        setShowApp(false);
      }
    } catch (error) {
      console.error(error);
    }
  }).then((fn) => {
    unlisten = fn;
  });

  return () => {
    if (unlisten) unlisten();
    stopFollowingOverlay();
  };
}, []);


  useEffect(() => {
    invoke("set_magic_dot_creation_enabled", { enabled: true }).catch(() => {});
  }, []);

  return (
    <motion.div
      // animate={{
      //   opacity: showApp ? 1 : 0,
      //   // scale: showApp ? 1 : 0.9,
      // }}
      transition={{ duration: 0, ease: "circInOut", type: "tween" }}
      className="rounded-lg size-full overflow-hidden flex flex-col relative items-center"
    >
      <AnimatePresence>
        {showApp && (
          <>
            <motion.div
              initial={{
                height: "512px",
                width: "480px",
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                height: "600px",
                width: "1000px",
              }}
              exit={{
                height: "512px",
                width: "480px",
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "circInOut",
                type: "tween",
                opacity: {
                  duration: 0
                }
              }}
              className="flex  overflow-hidden rounded-lg "
            >
              <div className="w-[1000px] h-[600px] flex shrink-0">
                <Sidebar />
                <Outlet />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
