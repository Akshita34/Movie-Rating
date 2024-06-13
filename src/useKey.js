import { useState, useEffect } from "react";

export default function useKey(key, inplutEl, callBack) {
  useEffect(
    function () {
      // console.log(inplutEl.current);
      function callBack(e) {
        if (document.activeElement === inplutEl.current) return;
        if (e.code === "Enter") {
          inplutEl.current.focus();
          callBack("");
          //   setQuery("");
        }
      }
      document.addEventListener("keydown", callBack);
    },
    [callBack]
  );
}
