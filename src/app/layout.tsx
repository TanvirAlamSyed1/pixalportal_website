// app/layout.tsx
import './globals.css';
export const metadata = {
  title: 'Pixal Portal',
  description: 'Login Page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
