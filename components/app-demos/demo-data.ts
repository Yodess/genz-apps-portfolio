import type { KodianeData, MakineData } from './types'

// ─── Kodiane Demo Data ───
export const kodianeData: KodianeData = {
  lists: [
    {
      id: 'l1',
      name: 'Marché Baraki',
      date: '2026-03-25',
      location: 'Baraki, Alger',
      status: 'en-cours',
      items: [
        { productId: 'p1', productName: 'Riz Basmati 5kg', emoji: '🍚', supplierId: 's1', supplierName: 'Boucherie El Baraka', quantity: 10, price: 850, unit: 'sac' },
        { productId: 'p2', productName: 'Huile de tournesol 5L', emoji: '🫒', supplierId: 's1', supplierName: 'Boucherie El Baraka', quantity: 5, price: 750, unit: 'bidon' },
        { productId: 'p3', productName: 'Sucre blanc 5kg', emoji: '🧂', supplierId: 's2', supplierName: 'Grossiste Samir', quantity: 8, price: 420, unit: 'sac' },
        { productId: 'p4', productName: 'Lait en poudre 2.5kg', emoji: '🥛', supplierId: 's2', supplierName: 'Grossiste Samir', quantity: 6, price: 1800, unit: 'boîte' },
        { productId: 'p5', productName: 'Tomate concentrée 800g', emoji: '🍅', supplierId: 's1', supplierName: 'Boucherie El Baraka', quantity: 20, price: 180, unit: 'boîte' },
      ],
    },
    {
      id: 'l2',
      name: 'Grossiste Blida',
      date: '2026-03-20',
      location: 'Blida Centre',
      status: 'termine',
      items: [
        { productId: 'p1', productName: 'Riz Basmati 5kg', emoji: '🍚', supplierId: 's3', supplierName: 'Entrepôt Blida', quantity: 20, price: 800, unit: 'sac' },
        { productId: 'p6', productName: 'Semoule fine 25kg', emoji: '🌾', supplierId: 's3', supplierName: 'Entrepôt Blida', quantity: 5, price: 2200, unit: 'sac' },
        { productId: 'p7', productName: 'Café moulu 250g', emoji: '☕', supplierId: 's3', supplierName: 'Entrepôt Blida', quantity: 30, price: 350, unit: 'paquet' },
      ],
    },
  ],
  suppliers: [
    { id: 's1', name: 'Boucherie El Baraka', emoji: '🏪', phone: '0555 12 34 56', location: 'Baraki, Alger', productCount: 3 },
    { id: 's2', name: 'Grossiste Samir', emoji: '🏭', phone: '0661 78 90 12', location: 'Bab Ezzouar', productCount: 2 },
    { id: 's3', name: 'Entrepôt Blida', emoji: '📦', phone: '0770 45 67 89', location: 'Blida Centre', productCount: 3 },
  ],
  products: [
    { id: 'p1', name: 'Riz Basmati 5kg', emoji: '🍚', unit: 'sac', prices: [{ supplier: 'Boucherie El Baraka', price: 850, tier: 'détail' }, { supplier: 'Entrepôt Blida', price: 800, tier: 'gros' }] },
    { id: 'p2', name: 'Huile de tournesol 5L', emoji: '🫒', unit: 'bidon', prices: [{ supplier: 'Boucherie El Baraka', price: 750, tier: 'détail' }] },
    { id: 'p3', name: 'Sucre blanc 5kg', emoji: '🧂', unit: 'sac', prices: [{ supplier: 'Grossiste Samir', price: 420, tier: 'demi-gros' }] },
    { id: 'p4', name: 'Lait en poudre 2.5kg', emoji: '🥛', unit: 'boîte', prices: [{ supplier: 'Grossiste Samir', price: 1800, tier: 'détail' }] },
    { id: 'p5', name: 'Tomate concentrée 800g', emoji: '🍅', unit: 'boîte', prices: [{ supplier: 'Boucherie El Baraka', price: 180, tier: 'gros' }] },
    { id: 'p6', name: 'Semoule fine 25kg', emoji: '🌾', unit: 'sac', prices: [{ supplier: 'Entrepôt Blida', price: 2200, tier: 'gros' }] },
    { id: 'p7', name: 'Café moulu 250g', emoji: '☕', unit: 'paquet', prices: [{ supplier: 'Entrepôt Blida', price: 350, tier: 'demi-gros' }] },
  ],
  purchases: [
    { id: 'pu1', listName: 'Grossiste Blida', date: '2026-03-20', location: 'Blida Centre', totalSpent: 37500, itemCount: 55 },
    { id: 'pu2', listName: 'Marché Kouba', date: '2026-03-15', location: 'Kouba, Alger', totalSpent: 24800, itemCount: 32 },
    { id: 'pu3', listName: 'Restock Baraki', date: '2026-03-10', location: 'Baraki, Alger', totalSpent: 18200, itemCount: 20 },
  ],
}

// ─── MakineApp Demo Data ───
export const makineData: MakineData = {
  stats: {
    capital: 850000,
    revenue: 342500,
    expenses: 178400,
    outstanding: 45000,
    wasteValue: 12300,
  },
  batches: [
    {
      id: 'b1', ref: 'BATCH-2026-042', date: '2026-03-24', expiryDate: '2026-09-24', status: 'completed',
      productName: 'Confiture de fraise',
      ingredients: [
        { name: 'Fraises fraîches', qtyUsed: 15, unit: 'kg', cost: 4500 },
        { name: 'Sucre cristallisé', qtyUsed: 8, unit: 'kg', cost: 1600 },
        { name: 'Pectine', qtyUsed: 0.3, unit: 'kg', cost: 900 },
        { name: 'Jus de citron', qtyUsed: 0.5, unit: 'L', cost: 200 },
      ],
      totalCost: 7200, qtyProduced: 40,
    },
    {
      id: 'b2', ref: 'BATCH-2026-041', date: '2026-03-22', expiryDate: '2026-09-22', status: 'completed',
      productName: 'Confiture d\'abricot',
      ingredients: [
        { name: 'Abricots frais', qtyUsed: 12, unit: 'kg', cost: 3600 },
        { name: 'Sucre cristallisé', qtyUsed: 7, unit: 'kg', cost: 1400 },
        { name: 'Pectine', qtyUsed: 0.25, unit: 'kg', cost: 750 },
      ],
      totalCost: 5750, qtyProduced: 35,
    },
    {
      id: 'b3', ref: 'BATCH-2026-043', date: '2026-03-26', expiryDate: '2026-09-26', status: 'pending',
      productName: 'Confiture de figue',
      ingredients: [
        { name: 'Figues séchées', qtyUsed: 10, unit: 'kg', cost: 5000 },
        { name: 'Sucre cristallisé', qtyUsed: 5, unit: 'kg', cost: 1000 },
        { name: 'Cannelle', qtyUsed: 0.1, unit: 'kg', cost: 300 },
      ],
      totalCost: 6300, qtyProduced: 0,
    },
  ],
  clients: [
    { id: 'c1', name: 'Fatima Benali', type: 'particulier', phone: '0555 11 22 33', email: 'fatima@email.com', totalPurchases: 12, totalRevenue: 18000, outstanding: 0 },
    { id: 'c2', name: 'Superette Amine', type: 'magasin', phone: '0661 44 55 66', email: 'amine.shop@email.com', totalPurchases: 45, totalRevenue: 135000, outstanding: 15000 },
    { id: 'c3', name: 'Épicerie Rachid', type: 'magasin', phone: '0770 77 88 99', email: 'rachid@email.com', totalPurchases: 28, totalRevenue: 84000, outstanding: 8000 },
    { id: 'c4', name: 'Distributeur Karim', type: 'revendeur', phone: '0550 99 00 11', email: 'karim.dist@email.com', totalPurchases: 60, totalRevenue: 280000, outstanding: 22000 },
    { id: 'c5', name: 'Nadia Khelifi', type: 'particulier', phone: '0666 22 33 44', email: 'nadia.k@email.com', totalPurchases: 5, totalRevenue: 7500, outstanding: 0 },
  ],
  sales: [
    { id: 'v1', clientName: 'Superette Amine', date: '2026-03-25', products: [{ name: 'Confiture de fraise', qty: 20, unitPrice: 450 }], total: 9000, paymentStatus: 'paid', amountPaid: 9000 },
    { id: 'v2', clientName: 'Distributeur Karim', date: '2026-03-24', products: [{ name: 'Confiture de fraise', qty: 30, unitPrice: 400 }, { name: 'Confiture d\'abricot', qty: 20, unitPrice: 420 }], total: 20400, paymentStatus: 'partial', amountPaid: 12000 },
    { id: 'v3', clientName: 'Épicerie Rachid', date: '2026-03-23', products: [{ name: 'Confiture d\'abricot', qty: 15, unitPrice: 450 }], total: 6750, paymentStatus: 'unpaid', amountPaid: 0 },
    { id: 'v4', clientName: 'Fatima Benali', date: '2026-03-22', products: [{ name: 'Confiture de fraise', qty: 3, unitPrice: 500 }], total: 1500, paymentStatus: 'paid', amountPaid: 1500 },
  ],
  inventory: [
    { id: 'i1', name: 'Confiture de fraise', emoji: '🍓', quantity: 47, unit: 'pots', type: 'finished', status: 'active', expiryDate: '2026-09-24' },
    { id: 'i2', name: 'Confiture d\'abricot', emoji: '🍑', quantity: 15, unit: 'pots', type: 'finished', status: 'low', expiryDate: '2026-09-22' },
    { id: 'i3', name: 'Confiture de figue', emoji: '🫐', quantity: 0, unit: 'pots', type: 'finished', status: 'active' },
    { id: 'i4', name: 'Pots en verre 370ml', emoji: '🫙', quantity: 200, unit: 'pcs', type: 'consumable', status: 'active' },
    { id: 'i5', name: 'Couvercles dorés', emoji: '🔩', quantity: 180, unit: 'pcs', type: 'consumable', status: 'active' },
    { id: 'i6', name: 'Étiquettes adhésives', emoji: '🏷️', quantity: 45, unit: 'pcs', type: 'consumable', status: 'low' },
    { id: 'i7', name: 'Sucre cristallisé', emoji: '🧂', quantity: 25, unit: 'kg', type: 'consumable', status: 'active' },
    { id: 'i8', name: 'Pectine NH', emoji: '🧪', quantity: 2, unit: 'kg', type: 'consumable', status: 'low' },
  ],
}
