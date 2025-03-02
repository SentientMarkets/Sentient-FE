'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientWrapper ensures components only render on the client side
 * to prevent hydration errors when using browser-only APIs
 */
const ClientWrapper = ({ children, fallback }: ClientWrapperProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
};

export default ClientWrapper;