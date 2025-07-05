interface HotbarCardProps {
  item?: [string, unknown] | null;
  isLoading?: boolean;
  hasError?: boolean;
}

function HotbarCard({ item, isLoading, hasError }: HotbarCardProps) {
  if (isLoading) {
    return (
      <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-white text-xs">
        <div className="text-gray-500">...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-white text-xs">
        <div className="text-red-500">!</div>
      </div>
    );
  }

  return (
    <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded flex items-center justify-center text-white text-xs">
      {item ? (
        <div className="text-center">
          <div className="font-bold">{String(item[0])}</div>
          <div>{String(item[1])}</div>
        </div>
      ) : (
        <div className="text-gray-500">-</div>
      )}
    </div>
  );
}

export default HotbarCard;
