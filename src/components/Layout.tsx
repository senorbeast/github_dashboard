"use client";

import { useRef } from "react";
import useStore from "@/store/store";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef(null);
    const dark = useStore((state) => state.darkMode);

    return (
        <div
            ref={ref}
            className={`${dark ? "dark" : ""}`}
            style={{
                position: "relative",
                width: " 100%",
                height: "100%",
                overflow: "auto",
                touchAction: "auto",
            }}
        >
            {children}
        </div>
    );
};

export { Layout };
