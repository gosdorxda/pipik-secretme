interface BrandNameProps {
  name: string;
  className?: string;
}

export function BrandName({ name, className }: BrandNameProps) {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex === -1) return <span className={className}>{name}</span>;
  return (
    <span className={className}>
      {name.slice(0, dotIndex)}
      <span className="text-primary">{name.slice(dotIndex)}</span>
    </span>
  );
}
