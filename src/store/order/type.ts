export interface OrderResponse {
  success: boolean
  orders: Order[]
  pagination: Pagination
}

export interface Order {
  contact: Contact
  shipping: Shipping
  _id: string
  items: Item[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  paymentStatus: string
  orderStatus: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Contact {
  fullName: string
  email: string
  phone: string
}

export interface Shipping {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Item {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  _id: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
