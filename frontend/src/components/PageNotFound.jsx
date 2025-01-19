import React from "react";

export default function PageNotFound() {
  return (
    <>
      <div className="flex h-screen items-center justify-center space-x-2 flex-col">
        <span>404</span>

        <div className="text-xl font-semibold text-green-800">
          Page Not Found
        </div>
      </div>
    </>
  );
}
