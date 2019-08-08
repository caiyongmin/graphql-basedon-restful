type User = {
  id: string;
  name: string;
  orders?: [Order]
};

type Order = {
  id: string;
  created: string;
  price: number;
  user?: User;
  product?: Product;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  orders?: [Order];
};

interface DB {
  users: User[];
  products: Product[];
  orders: Order[];
}

export const db: DB = {
  users: [],
  orders: [],
  products: [],
};
