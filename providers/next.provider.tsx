"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

const queryClient = new QueryClient()


export const NextAuthProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#f8fafc',
            },
          }}
        />
      </SessionProvider>
    </QueryClientProvider>
  )
}
