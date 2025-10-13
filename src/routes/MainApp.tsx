import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import Sidebar from "@/components/app/Sidebar";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalPosition } from "@tauri-apps/api/dpi";
import { AnimatePresence, motion } from "motion/react";
import { currentMonitor, getAllWindows } from "@tauri-apps/api/window";

// Navigation Manager - handles all navigation-related functionality
const createNavigationManager = (navigate: (to: string) => void) => {
  const handleNavigationEvent = (event: { to: string }) => {
    navigate(event.to);
  };

  const setupNavigationListener = () => {
    let unlisten: (() => void) | undefined;

    listen<{ to: string }>("navigate_to", async (event) => {
      handleNavigationEvent(event.payload);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
    };
  };

  return {
    setupNavigationListener
  };
};

// Window Follower Manager - handles window following logic
const createWindowFollowerManager = () => {
  const followFrame = { current: null as number | null };
  const following = { current: false };

  const followOverlay = async () => {
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
  };

  const startFollowing = () => {
    if (!following.current) {
      following.current = true;
      followOverlay();
    }
  };

  const stopFollowing = () => {
    following.current = false;
    if (followFrame.current) {
      cancelAnimationFrame(followFrame.current);
      followFrame.current = null;
    }
  };

  return {
    startFollowing,
    stopFollowing
  };
};

// App Visibility Manager - handles app show/hide logic
const createAppVisibilityManager = (
  setShowApp: (show: boolean) => void,
  windowFollower: any
) => {
  const showApp = async () => {
    try {
      const win = getCurrentWebviewWindow();

      invoke("show_app");

      // Position window relative to overlay first
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

      // Update state and start following
      setShowApp(true);
      await win.setFocus();
      windowFollower.startFollowing();
    } catch (error) {
      console.error("Failed to show app:", error);
    }
  };

  const hideApp = async () => {
    try {
      invoke("hide_app");
      windowFollower.stopFollowing();
      setShowApp(false);
    } catch (error) {
      console.error("Failed to hide app:", error);
    }
  };

  const setupAppVisibilityListener = () => {
    let unlisten: (() => void) | undefined;

    listen<{ show: boolean }>("show_app", async (event) => {
      if (event.payload.show) {
        await showApp();
      } else {
        await hideApp();
      }
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      if (unlisten) unlisten();
      windowFollower.stopFollowing();
    };
  };

  return {
    setupAppVisibilityListener
  };
};

// Event Listener Manager - handles Tauri event listeners
const createEventListenerManager = (navigate: (to: string) => void) => {
  const setupTransferChatListener = () => {
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
  };

  return {
    setupTransferChatListener
  };
};

export default function MainApp() {
  const navigate = useNavigate();

  const [showApp, setShowApp] = useState(false);

  // Initialize managers
  const navigationManager = createNavigationManager(navigate);
  const windowFollower = createWindowFollowerManager();
  const appVisibilityManager = createAppVisibilityManager(setShowApp, windowFollower);
  const eventListenerManager = createEventListenerManager(navigate);

  // Setup navigation listener
  useEffect(navigationManager.setupNavigationListener, [navigate]);

  // Setup transfer chat listener
  useEffect(eventListenerManager.setupTransferChatListener, [navigate]);

  // Setup app visibility listener
  useEffect(appVisibilityManager.setupAppVisibilityListener, []);

  // Enable magic dot creation
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
