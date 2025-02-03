import { AuthProvider } from './context/authContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trello-Like',
  description: 'Gestion de tâches simple',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='fr'>
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
