"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const ClockContext = createContext<Date>(new Date());

export const useClock = () => useContext(ClockContext);

export const ClockProvider = ({ children }: { children: React.ReactNode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <ClockContext.Provider value={time}>{children}</ClockContext.Provider>;
};
