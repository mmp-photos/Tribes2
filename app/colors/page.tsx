"use client";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AllColors from "../lib/colors/AllColors";"../lib/colors/AllColors";
import AddColor from "../lib/colors/AddColor"

const Colors = () => {
  const { setPageTitle } = useAuth(); 
  useEffect(() => {
    setPageTitle("She comes in colors");
  }, []);

  return (
    <main>
        <AllColors />
        {/* <AddColor /> */}
    </main>
  );
};

export default Colors;
