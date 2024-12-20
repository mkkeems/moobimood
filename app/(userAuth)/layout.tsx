export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center pt-10">
      {children}
    </div>
  );
}
