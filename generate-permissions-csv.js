const crypto = require('crypto')
const fs = require('fs')

const now = new Date().toISOString()

const permissions = [
  // ===== CATALOG-SERVICE =====
  { name: 'CREATE_BRAND', method: 'POST', path: '/v1/brands/', module: 'catalog-service', isPublic: false },
  { name: 'UPDATE_BRAND', method: 'PUT', path: '/v1/brands/:id', module: 'catalog-service', isPublic: false },
  { name: 'UPLOAD_BRAND_LOGO', method: 'POST', path: '/v1/brands/upload-logo', module: 'catalog-service', isPublic: false },
  { name: 'DELETE_BRAND', method: 'DELETE', path: '/v1/brands/:id', module: 'catalog-service', isPublic: false },
  { name: 'GET_BRANDS_PAGINATED', method: 'GET', path: '/v1/brands/', module: 'catalog-service', isPublic: true },
  { name: 'CREATE_CATEGORY', method: 'POST', path: '/v1/categories/', module: 'catalog-service', isPublic: false },
  { name: 'GET_CATEGORIES', method: 'GET', path: '/v1/categories/', module: 'catalog-service', isPublic: true },
  { name: 'GET_ROOT_CATEGORIES', method: 'GET', path: '/v1/categories/root', module: 'catalog-service', isPublic: true },
  { name: 'GET_CATEGORY', method: 'GET', path: '/v1/categories/:id', module: 'catalog-service', isPublic: true },
  { name: 'UPLOAD_PRODUCT_IMAGE', method: 'POST', path: '/v1/products/upload-image', module: 'catalog-service', isPublic: false },
  { name: 'UPLOAD_PRODUCT_VIDEO', method: 'POST', path: '/v1/products/upload-video', module: 'catalog-service', isPublic: false },
  { name: 'CREATE_PRODUCT', method: 'POST', path: '/v1/products/', module: 'catalog-service', isPublic: false },
  { name: 'GET_SHOP_PRODUCTS_PAGINATED', method: 'GET', path: '/v1/products/shop/:shopId', module: 'catalog-service', isPublic: false },
  { name: 'GET_PRODUCT_DETAIL', method: 'GET', path: '/v1/products/:id', module: 'catalog-service', isPublic: true },
  { name: 'UPDATE_PRODUCT', method: 'PUT', path: '/v1/products/:id', module: 'catalog-service', isPublic: false },
  { name: 'SOFT_DELETE_PRODUCT', method: 'DELETE', path: '/v1/products/:id/soft-delete', module: 'catalog-service', isPublic: false },
  { name: 'HIDE_PRODUCT', method: 'PATCH', path: '/v1/products/:id/hide', module: 'catalog-service', isPublic: false },
  { name: 'UNHIDE_PRODUCT', method: 'PATCH', path: '/v1/products/:id/unhide', module: 'catalog-service', isPublic: false },
  { name: 'GET_PRODUCTS_PAGINATED', method: 'GET', path: '/v1/products/', module: 'catalog-service', isPublic: false },
  { name: 'APPROVE_PRODUCT', method: 'PATCH', path: '/v1/products/:id/approve', module: 'catalog-service', isPublic: false },
  { name: 'REJECT_PRODUCT', method: 'PATCH', path: '/v1/products/:id/reject', module: 'catalog-service', isPublic: false },
  { name: 'GET_PRODUCT_TO_SOLD', method: 'GET', path: '/v1/products/:id/to-sold', module: 'catalog-service', isPublic: false },
  { name: 'GET_PRODUCT_REVIEWS_PAGINATED', method: 'GET', path: '/v1/products/:id/reviews', module: 'catalog-service', isPublic: true },
  { name: 'CREATE_PRODUCT_REVIEW', method: 'POST', path: '/v1/products/:id/reviews', module: 'catalog-service', isPublic: false },
  { name: 'GET_SHOP_REVIEWS_PAGINATED', method: 'GET', path: '/v1/products/shop/:shopId/reviews', module: 'catalog-service', isPublic: false },
  { name: 'GET_REPORTED_REVIEWS_PAGINATED', method: 'GET', path: '/v1/products/reviews/reported', module: 'catalog-service', isPublic: false },
  { name: 'HIDE_PRODUCT_REVIEW', method: 'PATCH', path: '/v1/products/reviews/:id/hide', module: 'catalog-service', isPublic: false },
  { name: 'REPORT_REVIEW', method: 'POST', path: '/v1/reviews/:id/report', module: 'catalog-service', isPublic: false },
  { name: 'CREATE_REVIEW_REPLY', method: 'POST', path: '/v1/reviews/:id/reply', module: 'catalog-service', isPublic: false },

  // ===== CHAT-SERVICE =====
  { name: 'GET_CONVERSATIONS', method: 'GET', path: '/v1/chats/conversations', module: 'chat-service', isPublic: false },
  { name: 'GET_MESSAGES', method: 'GET', path: '/v1/chats/conversations/:id/messages', module: 'chat-service', isPublic: false },
  { name: 'SEND_MESSAGE', method: 'POST', path: '/v1/chats/conversations/messages', module: 'chat-service', isPublic: false },
  { name: 'MARK_AS_READ', method: 'PATCH', path: '/v1/chats/conversations/:id/read', module: 'chat-service', isPublic: false },
  { name: 'DELETE_MESSAGE', method: 'DELETE', path: '/v1/chats/messages/:id', module: 'chat-service', isPublic: false },
  { name: 'GET_UNREAD_COUNT', method: 'GET', path: '/v1/chats/unread-count', module: 'chat-service', isPublic: false },

  // ===== INVENTORY-SERVICE =====
  { name: 'CHECK_INVENTORY_TO_MINUS', method: 'PUT', path: '/v1/inventories/check-inventory-to-minus', module: 'inventory-service', isPublic: false },
  { name: 'CHECK_INVENTORY_TO_PLUS', method: 'PUT', path: '/v1/inventories/check-inventory-to-plus', module: 'inventory-service', isPublic: false },

  // ===== ORDER-SERVICE =====
  { name: 'GET_ADMIN_ORDERS', method: 'GET', path: '/v1/orders', module: 'order-service', isPublic: false },
  { name: 'GET_USER_ORDERS', method: 'GET', path: '/v1/orders/users/:userId', module: 'order-service', isPublic: false },
  { name: 'CALCULATE_PRICE', method: 'POST', path: '/v1/orders/calculate-price', module: 'order-service', isPublic: false },
  { name: 'CANCEL_ORDER', method: 'PATCH', path: '/v1/orders/:orderId/cancel', module: 'order-service', isPublic: false },
  { name: 'ACCEPT_ORDER', method: 'PATCH', path: '/v1/orders/:orderId/accept', module: 'order-service', isPublic: false },
  { name: 'DISPATCH_ORDER_TO_CARRIER', method: 'PATCH', path: '/v1/orders/:orderId/dispatch-to-carrier', module: 'order-service', isPublic: false },
  { name: 'GET_SHOP_ORDERS', method: 'GET', path: '/v1/orders/shop/:shopId', module: 'order-service', isPublic: false },
  { name: 'ARRIVED_WAREHOUSE', method: 'POST', path: '/v1/orders/:id/arrived-warehouse', module: 'order-service', isPublic: false },
  { name: 'GET_ORDER_TO_SHIPPER', method: 'GET', path: '/v1/orders/:id/shipper', module: 'order-service', isPublic: false },
  { name: 'GET_ORDER_DELIVERY_HISTORY', method: 'GET', path: '/v1/orders/:id/delivery-history', module: 'order-service', isPublic: false },
  { name: 'DELIVERY_SUCCESS', method: 'POST', path: '/v1/orders/:id/delivery-success', module: 'order-service', isPublic: false },
  { name: 'DELIVERY_FAIL', method: 'POST', path: '/v1/orders/:id/delivery-fail', module: 'order-service', isPublic: false },
  { name: 'REQUEST_RETURN_ORDER_ITEM', method: 'PATCH', path: '/v1/orders/items/:itemId/return-request', module: 'order-service', isPublic: false },
  { name: 'GET_SCANNER_WAREHOUSE', method: 'GET', path: '/v1/scanners/:scannerId/warehouse', module: 'order-service', isPublic: false },
  { name: 'GET_SHOP_SETTLEMENTS', method: 'GET', path: '/v1/settlements/shop/:shopId', module: 'order-service', isPublic: false },
  { name: 'CREATE_WAREHOUSE', method: 'POST', path: '/v1/warehouses', module: 'order-service', isPublic: false },

  // ===== PAYMENT-SERVICE =====
  { name: 'SEPAY_WEBHOOK', method: 'POST', path: '/v1/payments/sepay-webhook', module: 'payment-service', isPublic: true },

  // ===== SAGA-ORCHESTRATOR =====
  { name: 'PLACE_ORDER', method: 'POST', path: '/v1/sagas/place-order', module: 'saga-orchestrator', isPublic: false },
  { name: 'CONFIRM_WALLET_PAYMENT', method: 'POST', path: '/v1/sagas/confirm-wallet-payment', module: 'saga-orchestrator', isPublic: false },

  // ===== SEARCH-SERVICE =====
  { name: 'TRACK_PRODUCT_VIEW', method: 'POST', path: '/v1/recommendations/views', module: 'search-service', isPublic: false },
  { name: 'GET_TODAY_RECOMMENDATIONS', method: 'GET', path: '/v1/recommendations/', module: 'search-service', isPublic: true },
  { name: 'SEARCH_PRODUCTS', method: 'GET', path: '/v1/searchs/', module: 'search-service', isPublic: true },
  { name: 'GET_ROOT_CATEGORY_PRODUCTS', method: 'GET', path: '/v1/searchs/root-category-products', module: 'search-service', isPublic: true },

  // ===== SHOP-SERVICE =====
  { name: 'GET_SHOPS_PAGINATED', method: 'GET', path: '/v1/admin/shops/', module: 'shop-service', isPublic: false },
  { name: 'APPROVE_SHOP', method: 'PATCH', path: '/v1/admin/shops/:id/approve', module: 'shop-service', isPublic: false },
  { name: 'REJECT_SHOP', method: 'PATCH', path: '/v1/admin/shops/:id/reject', module: 'shop-service', isPublic: false },
  { name: 'BAN_SHOP', method: 'PATCH', path: '/v1/admin/shops/:id/ban', module: 'shop-service', isPublic: false },
  { name: 'UNBAN_SHOP', method: 'PATCH', path: '/v1/admin/shops/:id/unban', module: 'shop-service', isPublic: false },
  { name: 'CREATE_SHOP', method: 'POST', path: '/v1/shops/', module: 'shop-service', isPublic: false },
  { name: 'HAS_SHOP', method: 'GET', path: '/v1/shops/has-shop', module: 'shop-service', isPublic: false },
  { name: 'GET_SHOP_BY_OWNER_ID', method: 'GET', path: '/v1/shops/', module: 'shop-service', isPublic: false },
  { name: 'UPDATE_SHOP_LOGO', method: 'PATCH', path: '/v1/shops/:id/logo', module: 'shop-service', isPublic: false },
  { name: 'UPDATE_SHOP', method: 'PUT', path: '/v1/shops/:id/', module: 'shop-service', isPublic: false },
  { name: 'TOGGLE_JOIN_SALE_CAMPAIGN', method: 'PATCH', path: '/v1/shops/:id/sale-campaign', module: 'shop-service', isPublic: false },
  { name: 'CLOSE_SHOP', method: 'PATCH', path: '/v1/shops/:id/close', module: 'shop-service', isPublic: false },

  // ===== USER-SERVICE =====
  { name: 'GET_USERS_PAGINATED', method: 'GET', path: '/v1/admin/users/', module: 'user-service', isPublic: false },
  { name: 'BAN_USER', method: 'PATCH', path: '/v1/admin/users/:id/ban', module: 'user-service', isPublic: false },
  { name: 'UNBAN_USER', method: 'PATCH', path: '/v1/admin/users/:id/unban', module: 'user-service', isPublic: false },
  { name: 'CREATE_ROLE_CATEGORY', method: 'POST', path: '/v1/role-categories/', module: 'user-service', isPublic: false },
  { name: 'GET_TOP_LEVEL_CATEGORY_IDS', method: 'GET', path: '/v1/roles/:id/category-ids/top-level', module: 'user-service', isPublic: false },
  { name: 'ADD_TO_CART', method: 'PUT', path: '/v1/users/add-to-cart', module: 'user-service', isPublic: false },
  { name: 'DELETE_CART_ITEMS', method: 'PATCH', path: '/v1/users/delete-cart-items', module: 'user-service', isPublic: false },
  { name: 'UPDATE_CART_QUANTITY', method: 'PUT', path: '/v1/users/update-cart-quantity', module: 'user-service', isPublic: false },
  { name: 'UPDATE_ADDRESS', method: 'PUT', path: '/v1/users/address/:id', module: 'user-service', isPublic: false },
  { name: 'DELETE_ADDRESS', method: 'DELETE', path: '/v1/users/address/:id', module: 'user-service', isPublic: false },
  { name: 'SET_DEFAULT_ADDRESS', method: 'PATCH', path: '/v1/users/address/:id/set-default', module: 'user-service', isPublic: false },
  { name: 'CHECK_PASS_CODE', method: 'GET', path: '/v1/users/check-pass-code', module: 'user-service', isPublic: false },
  { name: 'CREATE_PASS_CODE', method: 'POST', path: '/v1/users/pass-code', module: 'user-service', isPublic: false },
  { name: 'CHANGE_PASS_CODE', method: 'PUT', path: '/v1/users/change-pass-code', module: 'user-service', isPublic: false },
  { name: 'REQUEST_PASS_CODE_RESET', method: 'POST', path: '/v1/users/request-pass-code-reset', module: 'user-service', isPublic: false },
  { name: 'RESET_PASS_CODE', method: 'PUT', path: '/v1/users/reset-pass-code', module: 'user-service', isPublic: false },
  { name: 'GET_WALLET_BALANCE', method: 'GET', path: '/v1/users/wallet', module: 'user-service', isPublic: false },
  { name: 'GET_PROFILE', method: 'GET', path: '/v1/users/:id', module: 'user-service', isPublic: false },
  { name: 'UPDATE_AVATAR', method: 'PATCH', path: '/v1/users/:id/avatar', module: 'user-service', isPublic: false },
  { name: 'UPDATE_PROFILE', method: 'PUT', path: '/v1/users/:id', module: 'user-service', isPublic: false },
  { name: 'GET_ADDRESSES', method: 'GET', path: '/v1/users/:id/address', module: 'user-service', isPublic: false },
  { name: 'GET_DEFAULT_ADDRESS', method: 'GET', path: '/v1/users/:id/address/default', module: 'user-service', isPublic: false },
  { name: 'ADD_ADDRESS', method: 'POST', path: '/v1/users/:id/address', module: 'user-service', isPublic: false },
  { name: 'CHANGE_PASSWORD', method: 'PUT', path: '/v1/users/:id/change-password', module: 'user-service', isPublic: false },
  { name: 'COUNT_CART_ITEMS', method: 'GET', path: '/v1/users/:id/count-cart-items', module: 'user-service', isPublic: false },
  { name: 'GET_CART', method: 'GET', path: '/v1/users/:id/cart', module: 'user-service', isPublic: false },

  // ===== VOUCHER-SERVICE =====
  { name: 'CREATE_SZONE_VOUCHER', method: 'POST', path: '/v1/admin/vouchers/', module: 'voucher-service', isPublic: false },
  { name: 'SOFT_DELETE_SZONE_VOUCHER', method: 'DELETE', path: '/v1/admin/vouchers/:id', module: 'voucher-service', isPublic: false },
  { name: 'UPDATE_SZONE_VOUCHER', method: 'PUT', path: '/v1/admin/vouchers/:id', module: 'voucher-service', isPublic: false },
  { name: 'GET_SHOP_VOUCHERS', method: 'GET', path: '/v1/vouchers/', module: 'voucher-service', isPublic: true },
  { name: 'GET_SZONE_VOUCHERS_PAGINATED', method: 'GET', path: '/v1/vouchers/szone', module: 'voucher-service', isPublic: false },
  { name: 'CREATE_SHOP_VOUCHER', method: 'POST', path: '/v1/vouchers/', module: 'voucher-service', isPublic: false },
  { name: 'SOFT_DELETE_SHOP_VOUCHER', method: 'DELETE', path: '/v1/vouchers/:id', module: 'voucher-service', isPublic: false },
  { name: 'GET_VOUCHER_DETAIL', method: 'GET', path: '/v1/vouchers/:id', module: 'voucher-service', isPublic: true },
  { name: 'UPDATE_SHOP_VOUCHER', method: 'PUT', path: '/v1/vouchers/:id', module: 'voucher-service', isPublic: false },
  { name: 'GET_ELIGIBLE_SHOP_VOUCHERS', method: 'POST', path: '/v1/vouchers/shops/:shopId/eligible', module: 'voucher-service', isPublic: false },
  { name: 'GET_ELIGIBLE_SZONE_VOUCHERS', method: 'POST', path: '/v1/vouchers/platform-vouchers/eligible', module: 'voucher-service', isPublic: false },
]

// CSV header
const header = 'id,name,description,method,path,module,is_public,created_at,updated_at'
const rows = permissions.map(p => {
  const id = crypto.randomUUID()
  const description = ''
  const isPublic = p.isPublic ? 'true' : 'false'
  return `${id},${p.name},${description},${p.method},${p.path},${p.module},${isPublic},${now},${now}`
})

const csv = [header, ...rows].join('\n')
fs.writeFileSync('permissions.csv', csv)
console.log(`Generated ${permissions.length} permissions to permissions.csv`)
