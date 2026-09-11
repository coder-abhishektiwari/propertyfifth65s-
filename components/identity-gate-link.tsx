"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCustomer } from "@/components/providers/customer-context";
import type { ReactNode } from "react";

interface IdentityGateProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function IdentityGate({ href, children, className }: IdentityGateProps) {
  const router = useRouter();
  const { isComplete, isLoading, openDialog } = useCustomer();
  const pendingHref = useRef<string | null>(null);

  useEffect(() => {
    if (isComplete && pendingHref.current) {
      const target = pendingHref.current;
      pendingHref.current = null;
      router.push(target);
    }
  }, [isComplete, router]);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (isLoading) return;
    if (isComplete) {
      router.push(href);
    } else {
      pendingHref.current = href;
      openDialog();
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {children}
    </button>
  );
}
