const fs = require('fs')

// ===== ROLES =====
const roles = {
  CUSTOMER:           'a1076e42-25f0-4e3f-916a-d1412ce63c2a',
  SELLER:             '9c571637-1931-489a-b9a0-9a11cd4d6e17',
  SUPER_ADMIN:        'ed299a58-ba9f-451d-9b24-23573ed9f380',
  CUSTOMER_ADMIN:     '902c94c2-e1ac-4bfe-ab40-d0d725141241',
  FASHION_ADMIN:      '30ea1d43-04be-4843-826c-6210679ff084',
  BEAUTY_HEALTH_ADMIN:'fb17af35-844e-434f-a16e-71b1cc7a9f17',
  TECH_ADMIN:         'e2664000-3423-427f-b5e4-0576223931c7',
  HOME_LIFESTYLE_ADMIN:'f8516dd1-9996-43b0-b3b0-dbd719296121',
  LEISURE_ADMIN:      'e262fb84-8312-41c0-980e-849293b6261d',
  FOOD_BEVERAGE_ADMIN:'4608ebfb-98e9-4019-a390-ae95ef7b3687',
  SHIPPER:            '4608ebfb-98e9-4019-a390-ae95ef7b3666',
  WAREHOUSE_SCANNER:  '4608ebfb-98e9-4019-a390-ae95ef7b3667',
}

// ===== PERMISSIONS (từ permissions.csv) =====
const permissions = [
  { id: '9c4fe8d0-d791-4e6f-b3d9-f53fa777e31a', name: 'CREATE_BRAND' },
  { id: 'db161b34-065b-4f94-992c-9a3d0561252d', name: 'UPDATE_BRAND' },
  { id: '307f855b-dda7-4f5e-adea-bdb568445d59', name: 'UPLOAD_BRAND_LOGO' },
  { id: 'dae7bb49-374d-457b-ae94-91172a63672d', name: 'DELETE_BRAND' },
  { id: 'dceac3de-2d9a-4dbd-a6dc-bfa7647a7321', name: 'GET_BRANDS_PAGINATED' },
  { id: '20e5123f-f389-42e1-9d87-5b0a46d9225b', name: 'CREATE_CATEGORY' },
  { id: 'b65c0085-23ba-44a0-8b5a-ae82f3991fb3', name: 'GET_CATEGORIES' },
  { id: '80833a3f-8059-4619-a4cd-946d3eafa6a6', name: 'GET_ROOT_CATEGORIES' },
  { id: 'ef89951b-777a-42d6-bc6e-b9a8ba4477d1', name: 'GET_CATEGORY' },
  { id: '8033d7ee-cd3a-45e7-ad38-3da667be9f69', name: 'UPLOAD_PRODUCT_IMAGE' },
  { id: '2316ca9c-6213-4a35-afe1-33fe36d29b68', name: 'UPLOAD_PRODUCT_VIDEO' },
  { id: '0d46b230-b85b-4664-b4ae-d06a90397e03', name: 'CREATE_PRODUCT' },
  { id: 'ab639ef1-7bb8-44e0-9b9c-31998539e3ed', name: 'GET_SHOP_PRODUCTS_PAGINATED' },
  { id: 'd51cf1c0-d85d-4855-aaa3-b7bca5b96c0b', name: 'GET_PRODUCT_DETAIL' },
  { id: 'dc43eb9b-9e42-456b-98f4-92247d7cd496', name: 'UPDATE_PRODUCT' },
  { id: '95c0c988-6ab2-4f49-b6a1-5810d43dd207', name: 'SOFT_DELETE_PRODUCT' },
  { id: '3a8363dd-1805-4c1a-b105-43a483ecf785', name: 'HIDE_PRODUCT' },
  { id: 'f04e6042-c2d4-4b88-8e20-7b9788a0a024', name: 'UNHIDE_PRODUCT' },
  { id: 'cbaa15c4-1bfd-4660-bb30-a4c94e970738', name: 'GET_PRODUCTS_PAGINATED' },
  { id: '055910cc-316c-4fc7-9aa9-24354f05a6b5', name: 'APPROVE_PRODUCT' },
  { id: 'fcab54b5-0556-4b6b-8288-ee3ea7891a4c', name: 'REJECT_PRODUCT' },
  { id: '3f258503-bde9-47c7-898e-19ecbde8b1b9', name: 'GET_PRODUCT_TO_SOLD' },
  { id: '6cb2fee8-9572-4d9a-a667-35adc5598415', name: 'GET_PRODUCT_REVIEWS_PAGINATED' },
  { id: '74abac33-6328-47bb-bccb-486ce030edd3', name: 'CREATE_PRODUCT_REVIEW' },
  { id: '8d65512b-cdaa-424f-b941-be8e3486f39f', name: 'GET_SHOP_REVIEWS_PAGINATED' },
  { id: '63c7eccf-c82c-47e2-a17d-205288c9307b', name: 'GET_REPORTED_REVIEWS_PAGINATED' },
  { id: 'a477fcb1-4890-4ae9-bdfe-a9377dd49fac', name: 'HIDE_PRODUCT_REVIEW' },
  { id: 'd729eeac-4fe1-4fd2-9810-5b2ab590e72c', name: 'REPORT_REVIEW' },
  { id: '868205d0-5337-4656-9125-28cb83bf955e', name: 'CREATE_REVIEW_REPLY' },
  { id: 'f885421c-5ab5-4e55-9aee-26dfa2099e8c', name: 'GET_CONVERSATIONS' },
  { id: '123c677b-c489-4b19-af34-f2e360ac36cc', name: 'GET_MESSAGES' },
  { id: '6a0cb4a8-80fb-49e8-becc-46ad01f7f84f', name: 'SEND_MESSAGE' },
  { id: '7424cabd-390a-4698-b3f9-6116157beb8e', name: 'MARK_AS_READ' },
  { id: '63f1ba1b-2647-43a6-8100-f8376dba5cc8', name: 'DELETE_MESSAGE' },
  { id: '4fcceb5f-9bfc-44ad-ba8f-cfc0bd057206', name: 'GET_UNREAD_COUNT' },
  { id: 'b1b4dfd7-f2b0-4775-883d-f071c8f1c896', name: 'CHECK_INVENTORY_TO_MINUS' },
  { id: '6a23a5e8-c97d-4727-9c0f-bfbe01b79871', name: 'CHECK_INVENTORY_TO_PLUS' },
  { id: '848e7f4c-432b-457a-9ccc-ca490a98d123', name: 'GET_ADMIN_ORDERS' },
  { id: 'c0f88539-f6a5-458b-b8d3-0d0fe63be998', name: 'GET_USER_ORDERS' },
  { id: '2f9bb1c4-4739-43fa-b116-748403c60196', name: 'CALCULATE_PRICE' },
  { id: '677e1174-95f1-485a-9817-ce835e18a2fd', name: 'CANCEL_ORDER' },
  { id: '7a515af2-a791-4122-8f96-d87fb36212de', name: 'ACCEPT_ORDER' },
  { id: '0ca81ac5-e294-4c57-a955-102af28ad4af', name: 'DISPATCH_ORDER_TO_CARRIER' },
  { id: '3ee12e38-c3eb-43be-811f-b6edc1a61a87', name: 'GET_SHOP_ORDERS' },
  { id: '8ae90b2c-92aa-49c2-863d-d5a2e99163b9', name: 'ARRIVED_WAREHOUSE' },
  { id: 'af9ca778-2ea6-473e-8e16-7e932e83a3ab', name: 'GET_ORDER_TO_SHIPPER' },
  { id: 'e4710bb6-40cd-416e-acfc-e826b2d7edf8', name: 'GET_ORDER_DELIVERY_HISTORY' },
  { id: 'bde4f46a-6029-4ab2-91c0-78283da09f01', name: 'DELIVERY_SUCCESS' },
  { id: '632a5ab4-e1d2-4ac8-852d-ee3d62062be1', name: 'DELIVERY_FAIL' },
  { id: '9a81ac6c-4379-4e28-91aa-b66cea515ff6', name: 'REQUEST_RETURN_ORDER_ITEM' },
  { id: 'a533cfbb-3107-4a32-918e-8a191c3a88e0', name: 'GET_SCANNER_WAREHOUSE' },
  { id: '31befde6-ba92-44b6-a67a-6e59497892df', name: 'GET_SHOP_SETTLEMENTS' },
  { id: 'c71dbaaa-668d-4640-a170-a0fd4f93d749', name: 'CREATE_WAREHOUSE' },
  { id: '4d4011dd-bf6c-4bc4-858e-1a997e5de4bf', name: 'SEPAY_WEBHOOK' },
  { id: '18fe0435-c901-47be-aaa2-110686f01050', name: 'PLACE_ORDER' },
  { id: 'f7aa69c8-7206-4d21-a0d0-e6e1e7c66865', name: 'CONFIRM_WALLET_PAYMENT' },
  { id: '9493220a-4f30-4ff2-adaa-95dd4514da22', name: 'TRACK_PRODUCT_VIEW' },
  { id: '3364eb30-2ca7-4016-847a-49834a37cfdc', name: 'GET_TODAY_RECOMMENDATIONS' },
  { id: '26c70bd9-31d0-4b1f-9911-07bf782bcc4a', name: 'SEARCH_PRODUCTS' },
  { id: 'a16cb147-38ee-4e98-836d-13d6bb09c255', name: 'GET_ROOT_CATEGORY_PRODUCTS' },
  { id: 'a00fed37-190d-4f1b-9b73-9d18044d0aeb', name: 'GET_SHOPS_PAGINATED' },
  { id: '02eb21b9-9e93-4c33-8316-638e7da771e0', name: 'APPROVE_SHOP' },
  { id: '3bf4d1f2-c329-4708-8cdd-faef4a0c1d7b', name: 'REJECT_SHOP' },
  { id: 'da527266-43b8-42c9-9601-3e2f4b945d14', name: 'BAN_SHOP' },
  { id: '7cd6f60a-4da2-4969-8739-04d115d1e7c6', name: 'UNBAN_SHOP' },
  { id: 'e6afb708-bd9c-4ec2-84d2-8af59f66ed94', name: 'CREATE_SHOP' },
  { id: '20f1347f-cc75-4dbe-9983-57f4501fcc17', name: 'HAS_SHOP' },
  { id: '12ba87f8-83c3-452c-9ff7-ba7410f5d5e4', name: 'GET_SHOP_BY_OWNER_ID' },
  { id: 'bd1bbaca-96a8-40ac-8dfc-9dedd1ec64d8', name: 'UPDATE_SHOP_LOGO' },
  { id: 'bbb1b9ee-408f-4eb0-95c9-9145141515b2', name: 'UPDATE_SHOP' },
  { id: '52c23a6b-a301-44ce-8909-f0f717439dc9', name: 'TOGGLE_JOIN_SALE_CAMPAIGN' },
  { id: '6b0aa37e-f158-404d-8c76-1d2b37fbfb5a', name: 'CLOSE_SHOP' },
  { id: '672cfdbd-8330-42bb-979d-506c7721a148', name: 'GET_USERS_PAGINATED' },
  { id: '59ac1e62-cdd1-4a28-bbc9-8c8edda6ed66', name: 'BAN_USER' },
  { id: '6b887477-f6a6-461f-a465-b1426f9ee6c6', name: 'UNBAN_USER' },
  { id: '1595f099-8b37-4eb7-8f85-fbc8b5f9b9a0', name: 'CREATE_ROLE_CATEGORY' },
  { id: '7c7f8258-2a5a-4e26-b3ff-5e34432b5513', name: 'GET_TOP_LEVEL_CATEGORY_IDS' },
  { id: '0143eecc-c038-4806-ba09-040d20077c80', name: 'ADD_TO_CART' },
  { id: 'f972f59d-4bac-4584-97b1-cf1f08f1a5d5', name: 'DELETE_CART_ITEMS' },
  { id: '15507f4e-16ed-44cd-bdcd-afb6c0fc9bf7', name: 'UPDATE_CART_QUANTITY' },
  { id: '296e00e7-f25d-4245-84b4-fc2e49e19fc5', name: 'UPDATE_ADDRESS' },
  { id: '9119f5d9-8262-49fb-b6f7-a8fdab237f1f', name: 'DELETE_ADDRESS' },
  { id: '36c801ca-bdee-4594-b134-2e63cc542bdc', name: 'SET_DEFAULT_ADDRESS' },
  { id: 'f174e6bd-64f1-40da-ac90-961a404b8b76', name: 'CHECK_PASS_CODE' },
  { id: 'cba067d7-689c-4709-9d01-74d874aef8a2', name: 'CREATE_PASS_CODE' },
  { id: '405e91d8-aedb-4d74-8ef0-0bbced84da8a', name: 'CHANGE_PASS_CODE' },
  { id: 'a0e07bb1-792f-4d04-a99c-9ea4a89c8eec', name: 'REQUEST_PASS_CODE_RESET' },
  { id: '66a961bb-b4ca-415d-80cc-b21c0d7732f2', name: 'RESET_PASS_CODE' },
  { id: 'a6feee4a-80d4-476e-a9ce-37f5de8eb1fb', name: 'GET_WALLET_BALANCE' },
  { id: 'f30d3a9d-93dc-46b5-a451-24089eea1689', name: 'GET_PROFILE' },
  { id: 'facf3582-fb75-4d3b-a3ac-ca92f45a4404', name: 'UPDATE_AVATAR' },
  { id: '6e68dc87-157b-4727-bce8-eb803d4e47f6', name: 'UPDATE_PROFILE' },
  { id: '2d4eaf77-1ba7-4c51-b474-8c8256713234', name: 'GET_ADDRESSES' },
  { id: '8984c003-6b0a-4d5c-98c1-78b18e36070b', name: 'GET_DEFAULT_ADDRESS' },
  { id: '62b87042-3b7a-46de-b8ca-3f9259c013f4', name: 'ADD_ADDRESS' },
  { id: '10fc13c4-15f7-4fca-bc21-6b7fc4c0f8ee', name: 'CHANGE_PASSWORD' },
  { id: '8f4727e4-aa88-4322-a47b-bc5e3224ec60', name: 'COUNT_CART_ITEMS' },
  { id: '41351a1c-592a-442f-ba3a-600372353be0', name: 'GET_CART' },
  { id: 'b18c8771-9f9a-412e-9f80-d2797c0dc9c1', name: 'CREATE_SZONE_VOUCHER' },
  { id: 'a36201cb-3de6-4f7c-b01f-df29f08ce427', name: 'SOFT_DELETE_SZONE_VOUCHER' },
  { id: '2e502b41-6881-4847-8ce4-f0869826aab9', name: 'UPDATE_SZONE_VOUCHER' },
  { id: '94e1ee6b-78e0-4dbc-a577-6005038fe1bc', name: 'GET_SHOP_VOUCHERS' },
  { id: 'ea60bf75-42a4-45c0-9174-049c62972852', name: 'GET_SZONE_VOUCHERS_PAGINATED' },
  { id: '1d882e17-bf0f-4088-adb1-56fd318dce99', name: 'CREATE_SHOP_VOUCHER' },
  { id: '61681a51-a178-4f41-81a8-4429c56d558d', name: 'SOFT_DELETE_SHOP_VOUCHER' },
  { id: '30eae9fc-a9d4-4124-b2cc-53be8498bcd0', name: 'GET_VOUCHER_DETAIL' },
  { id: 'f79631ac-9786-4a4e-a10a-8af0c8e6c6f8', name: 'UPDATE_SHOP_VOUCHER' },
  { id: '6b58f3c7-32ea-4f08-aba3-7a95d89fa607', name: 'GET_ELIGIBLE_SHOP_VOUCHERS' },
  { id: 'aa2ea385-5f0d-4e9b-9d11-d4fff834c2de', name: 'GET_ELIGIBLE_SZONE_VOUCHERS' },
]

// ===== EXCLUDED SETS =====
const ALWAYS_EXCLUDED = new Set(['SEPAY_WEBHOOK']) // webhook dành riêng cho SePay

const ADMIN_EXCLUDED = new Set([...ALWAYS_EXCLUDED])

const CUSTOMER_EXCLUDED = new Set([
  ...ALWAYS_EXCLUDED,
  'CREATE_BRAND', 'UPDATE_BRAND', 'UPLOAD_BRAND_LOGO', 'DELETE_BRAND',
  'CREATE_CATEGORY',
  'HIDE_PRODUCT_REVIEW',
  'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'SOFT_DELETE_PRODUCT', 'HIDE_PRODUCT', 'UNHIDE_PRODUCT',
  'APPROVE_PRODUCT', 'REJECT_PRODUCT',
  'CREATE_REVIEW_REPLY',
  'GET_SHOPS_PAGINATED', 'APPROVE_SHOP', 'REJECT_SHOP', 'BAN_SHOP', 'UNBAN_SHOP',
  'UPDATE_SHOP_LOGO', 'UPDATE_SHOP', 'TOGGLE_JOIN_SALE_CAMPAIGN', 'CLOSE_SHOP',
  'CREATE_SZONE_VOUCHER', 'SOFT_DELETE_SZONE_VOUCHER', 'UPDATE_SZONE_VOUCHER',
  'CREATE_SHOP_VOUCHER', 'SOFT_DELETE_SHOP_VOUCHER', 'UPDATE_SHOP_VOUCHER',
  'GET_USERS_PAGINATED', 'BAN_USER', 'UNBAN_USER',
  'CREATE_ROLE_CATEGORY',
  'GET_ADMIN_ORDERS', 'ACCEPT_ORDER', 'DISPATCH_ORDER_TO_CARRIER', 'GET_SHOP_ORDERS',
  'ARRIVED_WAREHOUSE', 'GET_ORDER_TO_SHIPPER', 'DELIVERY_SUCCESS', 'DELIVERY_FAIL',
  'GET_SCANNER_WAREHOUSE', 'GET_SHOP_SETTLEMENTS', 'CREATE_WAREHOUSE',
])

const SELLER_EXCLUDED = new Set([
  ...ALWAYS_EXCLUDED,
  'CREATE_BRAND', 'UPDATE_BRAND', 'UPLOAD_BRAND_LOGO', 'DELETE_BRAND',
  'CREATE_CATEGORY',
  'HIDE_PRODUCT_REVIEW',
  'APPROVE_PRODUCT', 'REJECT_PRODUCT',
  'GET_SHOPS_PAGINATED', 'APPROVE_SHOP', 'REJECT_SHOP', 'BAN_SHOP', 'UNBAN_SHOP',
  'CREATE_SZONE_VOUCHER', 'SOFT_DELETE_SZONE_VOUCHER', 'UPDATE_SZONE_VOUCHER',
  'GET_USERS_PAGINATED', 'BAN_USER', 'UNBAN_USER',
  'CREATE_ROLE_CATEGORY',
  'GET_ADMIN_ORDERS',
  'ARRIVED_WAREHOUSE', 'GET_ORDER_TO_SHIPPER', 'DELIVERY_SUCCESS', 'DELIVERY_FAIL',
  'GET_SCANNER_WAREHOUSE', 'CREATE_WAREHOUSE',
])

const WAREHOUSE_SCANNER_ONLY = new Set(['ARRIVED_WAREHOUSE', 'GET_SCANNER_WAREHOUSE'])
const SHIPPER_ONLY = new Set(['GET_ORDER_TO_SHIPPER', 'DELIVERY_SUCCESS', 'DELIVERY_FAIL'])

// ===== ADMIN ROLES =====
const adminRoleIds = [
  roles.SUPER_ADMIN,
  roles.CUSTOMER_ADMIN,
  roles.FASHION_ADMIN,
  roles.BEAUTY_HEALTH_ADMIN,
  roles.TECH_ADMIN,
  roles.HOME_LIFESTYLE_ADMIN,
  roles.LEISURE_ADMIN,
  roles.FOOD_BEVERAGE_ADMIN,
]

// ===== GENERATE ROWS (A=permissionId, B=roleId) =====
const rows = []

// Admin roles: tất cả trừ SEPAY_WEBHOOK
for (const roleId of adminRoleIds) {
  for (const perm of permissions) {
    if (!ADMIN_EXCLUDED.has(perm.name)) {
      rows.push(`${perm.id},${roleId}`)
    }
  }
}

// CUSTOMER
for (const perm of permissions) {
  if (!CUSTOMER_EXCLUDED.has(perm.name)) {
    rows.push(`${perm.id},${roles.CUSTOMER}`)
  }
}

// SELLER
for (const perm of permissions) {
  if (!SELLER_EXCLUDED.has(perm.name)) {
    rows.push(`${perm.id},${roles.SELLER}`)
  }
}

// WAREHOUSE_SCANNER
for (const perm of permissions) {
  if (WAREHOUSE_SCANNER_ONLY.has(perm.name)) {
    rows.push(`${perm.id},${roles.WAREHOUSE_SCANNER}`)
  }
}

// SHIPPER
for (const perm of permissions) {
  if (SHIPPER_ONLY.has(perm.name)) {
    rows.push(`${perm.id},${roles.SHIPPER}`)
  }
}

const csv = ['A,B', ...rows].join('\n')
fs.writeFileSync('permission-to-role.csv', csv)
console.log(`Generated ${rows.length} rows to permission-to-role.csv`)
