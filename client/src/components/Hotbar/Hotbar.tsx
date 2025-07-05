import ListHotbar from "./ListHotbar";

function Hotbar() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
      <div className="flex gap-2 bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 border border-gray-600">
        <ListHotbar />
      </div>
    </div>
  );
}

export default Hotbar;
