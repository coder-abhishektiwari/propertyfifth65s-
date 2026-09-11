"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { getCustomerIdentity } from "@/lib/actions/customer-actions";

interface CustomerInfo {
  id: string;
  visitorId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
}

interface CustomerContextType {
  customer: CustomerInfo | null;
  isComplete: boolean;
  isLoading: boolean;
  dialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  onIdentityComplete: (customer: CustomerInfo) => void;
}

const CustomerContext = createContext<CustomerContextType>({
  customer: null,
  isComplete: false,
  isLoading: true,
  dialogOpen: false,
  openDialog: () => {},
  closeDialog: () => {},
  onIdentityComplete: () => {},
});

export function useCustomer() {
  return useContext(CustomerContext);
}

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const result = await getCustomerIdentity();
        if (result.success && result.customer) {
          setCustomer(result.customer);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    check();
  }, []);

  const openDialog = useCallback(() => setDialogOpen(true), []);
  const closeDialog = useCallback(() => setDialogOpen(false), []);

  const onIdentityComplete = useCallback((c: CustomerInfo) => {
    setCustomer(c);
    setDialogOpen(false);
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isComplete: !!customer,
        isLoading,
        dialogOpen,
        openDialog,
        closeDialog,
        onIdentityComplete,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
