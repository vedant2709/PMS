function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const colors = [
  "bg-blue-200 text-blue-800",
  "bg-green-200 text-green-800",
  "bg-yellow-200 text-yellow-800",
  "bg-pink-200 text-pink-800",
  "bg-purple-200 text-purple-800",
];

export default function AvatarInitials({
  name,
  size = 44,
  onClick = () => {},
}) {
  const initials = getInitials(name);
  const colorClass = colors[name?.length % colors?.length];

  return (
    <div
      onClick={onClick}
      className={`rounded-full flex items-center justify-center font-semibold cursor-pointer select-none ${colorClass}`}
      style={{
        width: size,
        height: size,
        fontSize: size / 2.3,
      }}
    >
      {initials}
    </div>
  );
}
