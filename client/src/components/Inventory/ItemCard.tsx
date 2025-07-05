interface Item {
  name: string;
  quantity: number;
}

const ItemCard = (item: Item) => {
  return (
    <div className="flex gap-3">
      <p>{item.name}</p>
      <p>{item.quantity}x</p>
    </div>
  );
};

export default ItemCard;
