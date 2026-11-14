"use client";

import { useEffect, useState } from "react";

const FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/**
 * The showroom's local time, as a mono reading: "Surat 14:32 IST". A small instrument
 * detail for visitors in other cities — is it working hours there?
 *
 * The server cannot know the visitor's moment, so the first render (server and client
 * alike) holds a dashed placeholder of the same width; the real time arrives after mount
 * and then updates on the minute, never per second. Nothing blinks.
 */
export function LocalTime({ city = "Surat" }: { city?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const now = new Date();
      setTime(FORMAT.format(now));
      // Wake at the start of the next minute, so the reading never lags a minute behind.
      timer = window.setTimeout(
        tick,
        60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()),
      );
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <span className="tabular-nums">
      {city} <time dateTime={time ?? undefined}>{time ?? "--:--"}</time> IST
    </span>
  );
}
