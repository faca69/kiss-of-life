interface HotbarCardProps {
  item?: [string, unknown] | null;
  isLoading?: boolean;
  hasError?: boolean;
  isSelected?: boolean;
  slotNumber?: number;
}

function HotbarCard({
  item,
  isLoading,
  hasError,
  isSelected,
  slotNumber,
}: HotbarCardProps) {
  if (isLoading) {
    return (
      <div
        className={`w-12 h-12 bg-gray-700 border rounded flex items-center justify-center text-white text-xs relative ${
          isSelected ? "border-blue-400 bg-blue-700/30" : "border-gray-600"
        }`}
      >
        <div className="text-gray-500">...</div>
        {slotNumber !== undefined && (
          <div className="absolute top-0 right-0 text-xs text-gray-400 bg-gray-800 rounded-bl px-1">
            {slotNumber}
          </div>
        )}
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`w-12 h-12 bg-gray-700 border rounded flex items-center justify-center text-white text-xs relative ${
          isSelected ? "border-blue-400 bg-blue-700/30" : "border-gray-600"
        }`}
      >
        <div className="text-red-500">!</div>
        {slotNumber !== undefined && (
          <div className="absolute top-0 right-0 text-xs text-gray-400 bg-gray-800 rounded-bl px-1">
            {slotNumber}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-12 h-12 bg-gray-700 border rounded flex items-center justify-center text-white text-xs relative ${
        isSelected ? "border-blue-400 bg-blue-700/30" : "border-gray-600"
      }`}
    >
      {item ? (
        <div className="text-center">
          <div className="font-bold">{String(item[0])}</div>
          <div>{String(item[1])}</div>
        </div>
      ) : (
        <div className="text-gray-500">-</div>
      )}
      {slotNumber !== undefined && (
        <div className="absolute top-0 right-0 text-xs text-gray-400 bg-gray-800 rounded-bl px-1">
          {slotNumber}
        </div>
      )}
    </div>
  );
}

export default HotbarCard;
