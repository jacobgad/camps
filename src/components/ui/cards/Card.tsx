type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return (
    <div
      className={
        "rounded-lg border border-gray-300 bg-white p-4 shadow-sm active:bg-indigo-50" +
        ` ${className}`
      }
    >
      {children}
    </div>
  );
}