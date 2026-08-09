import React from "react";

export default function BackgroundDecorations() {
  return (
    <>
      <div className="bg-grid-dots w-32 h-32 opacity-[0.03] absolute top-12 left-8 pointer-events-none"></div>
      <div className="bg-grid-dots w-40 h-40 opacity-[0.03] absolute bottom-40 right-8 pointer-events-none"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl absolute -top-40 -right-40 -z-10 pointer-events-none"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl absolute -bottom-40 -left-40 -z-10 pointer-events-none"></div>
    </>
  );
}
