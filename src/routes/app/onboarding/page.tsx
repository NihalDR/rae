import { listen } from "@tauri-apps/api/event";
import React, { useEffect, useState } from "react";

import Welcome from "./steps/Welcome";
import Onboard from "./steps/Onboard";
const Onboarding: React.FC = () => {
  const [step, setStep] = useState<string>("welcome");

  useEffect(() => {
    const unlisten = listen("onboarding_done", () => {
      if (step == "magic_dot") {
        setStep("finish");
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);
  // Ensure magic-dot creation is enabled while onboarding flows require it
  useEffect(() => {
    import("@tauri-apps/api/core").then(({ invoke }) => {
      invoke("set_magic_dot_creation_enabled", { enabled: true }).catch(
        () => {},
      );
    });
  }, []);
  const [shrunk, setShrunk] = useState<boolean>(false);

  return (
    <div
      className="min-h-screen flex flex-col rounded-lg overflow-hidden transition-transform duration-300 ease-in-out"
      style={{
        transform: `scale(${shrunk ? 0.9 : 1})`,
        transformOrigin: "top center",
      }}
    >
      {/* <div className="drag flex items-center justify-between p-0 bg-black text-white">
        <div className="flex items-center gap-2 pl-2">
          <span className="font-semibold">Rae</span>
        </div>
        <WindowControls
          shrunk={shrunk}
          onToggleShrink={() => setShrunk((s) => !s)}
          className="pr-2"
        />
      </div> */}
      {/*//After NAME IT DIRECTLY NAVS TO FINISH FOR NEW USERS*/}
      <div className="bg-background text-foreground flex-grow">
        {step === "welcome" && <Welcome onNext={setStep} />}
        {step === "onboard" && <Onboard onNext={setStep} />}
      </div>
    </div>
  );
};

export default Onboarding;
