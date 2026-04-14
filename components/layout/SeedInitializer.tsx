"use client";

import { useEffect } from "react";
import { seedIfEmpty } from "@/lib/seedDocuments";

/** Composant invisible — seed les données mock au premier mount. */
export function SeedInitializer() {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return null;
}
