type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      {children}
    </div>
  );
}
