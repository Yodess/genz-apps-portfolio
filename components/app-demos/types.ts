// ─── Shared ───
export type Device = 'desktop' | 'tablet' | 'mobile'

// ─── Kodiane Types ───
export interface KodianeProduct {
  id: string
  name: string
  emoji: string
  unit: string
  prices: { supplier: string; price: number; tier: string }[]
  image?: string
}

export interface KodianeSupplier {
  id: string
  name: string
  emoji: string
  phone?: string
  location?: string
  productCount: number
}

export interface KodianeListItem {
  productId: string
  productName: string
  emoji: string
  supplierId: string
  supplierName: string
  quantity: number
  price: number
  unit: string
}

export interface KodianeList {
  id: string
  name: string
  date: string
  location: string
  status: 'en-cours' | 'termine'
  items: KodianeListItem[]
}

export interface KodianePurchase {
  id: string
  listName: string
  date: string
  location: string
  totalSpent: number
  itemCount: number
}

export interface KodianeData {
  lists: KodianeList[]
  suppliers: KodianeSupplier[]
  products: KodianeProduct[]
  purchases: KodianePurchase[]
}

// ─── MakineApp Types ───
export interface MakineIngredient {
  name: string
  qtyUsed: number
  unit: string
  cost: number
}

export interface MakineBatch {
  id: string
  ref: string
  date: string
  expiryDate: string
  status: 'completed' | 'pending'
  ingredients: MakineIngredient[]
  totalCost: number
  qtyProduced: number
  productName: string
}

export interface MakineClient {
  id: string
  name: string
  type: 'particulier' | 'magasin' | 'revendeur'
  phone: string
  email: string
  totalPurchases: number
  totalRevenue: number
  outstanding: number
}

export interface MakineSale {
  id: string
  clientName: string
  date: string
  products: { name: string; qty: number; unitPrice: number }[]
  total: number
  paymentStatus: 'paid' | 'unpaid' | 'partial'
  amountPaid: number
}

export interface MakineInventoryItem {
  id: string
  name: string
  emoji: string
  quantity: number
  unit: string
  type: 'finished' | 'consumable'
  status: 'active' | 'low' | 'expired'
  expiryDate?: string
}

export interface MakineDashboardStats {
  capital: number
  revenue: number
  expenses: number
  outstanding: number
  wasteValue: number
}

export interface MakineData {
  stats: MakineDashboardStats
  batches: MakineBatch[]
  clients: MakineClient[]
  sales: MakineSale[]
  inventory: MakineInventoryItem[]
}
