import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Bosco AI | Professional Resume Builder</title>
      </head>
      <body className="bg-[#F8FAFC] text-slate-900 antialiased selection:bg-blue-100">
        {children}
      </body>
    </html>
  );
}