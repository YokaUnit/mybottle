export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-[100dvh] bg-white">{children}</div>;
}
