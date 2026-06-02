export default function Row({
  label,
  value,
  color
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 6
      }}
    >
      <span style={{color: '#9ca3af', flexShrink: 0}}>{label}</span>
      <span
        style={{
          fontWeight: 500,
          color: color ?? '#111827',
          textAlign: 'right',
          fontSize: 11
        }}
      >
        {value}
      </span>
    </div>
  );
}
