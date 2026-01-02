"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeartScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image 
        src="/heart.png" 
        alt="Cardiac Care Illustration" 
        width={600} 
        height={600}
        className="relative w-full h-full object-contain drop-shadow-2xl z-10"
        priority
      />
    </div>
  );
}

