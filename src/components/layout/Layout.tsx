type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Layout({ children, className }: Props) {
  return (
    <main className={className + " h-full"}>
      <div className="container mx-auto flex min-h-full max-w-md flex-col px-4 py-8">
        {children}
      </div>
    </main>
  );
}
