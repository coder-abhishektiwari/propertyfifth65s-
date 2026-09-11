"use client";

import { useRouter } from "next/navigation";
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

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (isLoading) return;
    if (isComplete) {
      router.push(href);
    } else {
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
