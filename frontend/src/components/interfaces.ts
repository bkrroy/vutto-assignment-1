export interface sellerType {
  id: number;
  email: string;
  full_name: string;
}

export interface BikeType {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: string;
  kilometers_driven: string;
  location: string;
  imageUrl: string;
  seller: sellerType;
  sellerId: number;
  created_at: string;
  updated_at: string;
}
