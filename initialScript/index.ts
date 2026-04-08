import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { RoleName } from '~/common/constants/constant'
import { hashPassword } from '~/common/utils/bcrypt.util'
import { v4 as uuidv4 } from 'uuid'
import { Gender } from '~/domain/enums/user.enum'
import * as dotenv from 'dotenv'

// Load environment variables
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envPath })

const prisma = new PrismaService()

const main = async () => {
  const roleCount = await prisma.role.count()
  if (roleCount > 0) throw new Error('Roles already exist')

  const roles = await prisma.role.createMany({
    data: [
      {
        // CHÚ Ý: ********* //
        id: 'a1076e42-25f0-4e3f-916a-d1412ce63c2a', // vì muốn import sẵn lên db của production các bản ghi hiện tại đang có trong db local
        // mà import như thế thì các giá trị như categoryId, roleId cần được giữ nguyên, nên sẽ import thằng giá trị uuid luôn thay vì uuidv4()
        name: RoleName.CUSTOMER,
        description: 'Role Khách hàng với các quyền hạn cơ bản',
      },
      {
        id: '9c571637-1931-489a-b9a0-9a11cd4d6e17',
        name: RoleName.SELLER,
        description: 'Role Người bán có quyền bán hàng và quản lí shop của mình',
      },
      {
        id: 'ed299a58-ba9f-451d-9b24-23573ed9f380',
        name: RoleName.SUPER_ADMIN,
        description: 'Super admin với toàn quyền quản trị hệ thống',
      },
      {
        id: '902c94c2-e1ac-4bfe-ab40-d0d725141241',
        name: RoleName.CUSTOMER_ADMIN,
        description: 'Customer admin quản lí người dùng và giải quyết tranh chấp giữa người dùng và người bán',
      },
      {
        id: '30ea1d43-04be-4843-826c-6210679ff084',
        name: RoleName.FASHION_ADMIN,
        description: 'Fashion admin quản lí các ngành hàng thời trang',
      },
      {
        id: 'fb17af35-844e-434f-a16e-71b1cc7a9f17',
        name: RoleName.BEAUTY_HEALTH_ADMIN,
        description: 'Beauty & Health admin quản lí các ngành hàng làm đẹp, sức khỏe, mẹ và bé',
      },
      {
        id: 'e2664000-3423-427f-b5e4-0576223931c7',
        name: RoleName.TECH_ADMIN,
        description: 'Tech admin quản lí các ngành hàng công nghệ',
      },
      {
        id: 'f8516dd1-9996-43b0-b3b0-dbd719296121',
        name: RoleName.HOME_LIFESTYLE_ADMIN,
        description: 'Home & Lifestyle admin quản lí các ngành hàng nhà cửa, đời sống',
      },
      {
        id: 'e262fb84-8312-41c0-980e-849293b6261d',
        name: RoleName.LEISURE_ADMIN,
        description: 'Leisure admin quản lí các ngành hàng thể thao, dã ngoại',
      },
      {
        id: '4608ebfb-98e9-4019-a390-ae95ef7b3687',
        name: RoleName.FOOD_BEVERAGE_ADMIN,
        description: 'Food & Beverage admin quản lí các ngành hàng đồ ăn, đồ uống',
      },
      {
        id: '4608ebfb-98e9-4019-a390-ae95ef7b3666',
        name: RoleName.SHIPPER,
        description: 'Shipper giao đơn hàng',
      },
      {
        id: '4608ebfb-98e9-4019-a390-ae95ef7b3667',
        name: RoleName.WAREHOUSE_SCANNER,
        description: 'Warehouse scanner quét mã QR trên đơn hàng đến ở kho mình phụ trách',
      },
    ],
  })

  // Tạo tài khoản super admin mặc định
  const superAdminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.SUPER_ADMIN,
    },
  })
  
  const superAdminPassword = await hashPassword(process.env.SUPER_ADMIN_PASSWORD!)
  const superAdmin = await prisma.user.create({
    data: {
      id: 'ebb52785-f0c7-4cee-aff0-6045fd1c7f0b',
      username: 'superadmin',
      email: process.env.SUPER_ADMIN_EMAIL!,
      password: superAdminPassword,
      roleId: superAdminRole.id,
      fullName: 'Super Admin',
      phoneNumber: '0123456789',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  await prisma.wallet.create({
    data: {
      id: uuidv4(),
      userId: superAdmin.id,
      balance: 0,
    }
  })

  // Tạo tài khoản customer admin mặc định
  const customerAdminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.CUSTOMER_ADMIN,
    },
  })
  const customerAdminPassword = await hashPassword(process.env.CUSTOMER_ADMIN_PASSWORD!)
  const customerAdmin = await prisma.user.create({
    data: {
      id: '77327cb5-322a-4818-818a-425c6ae58f16',
      username: 'customeradmin',
      email: process.env.CUSTOMER_ADMIN_EMAIL!,
      password: customerAdminPassword,
      roleId: customerAdminRole.id,
      fullName: 'Customer Admin',
      phoneNumber: '0123456788',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  // Tạo tài khoản fashion admin mặc định
  const fashionAdminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.FASHION_ADMIN,
    },
  })
  const fashionAdminPassword = await hashPassword(process.env.FASHION_ADMIN_PASSWORD!)
  const fashionAdmin = await prisma.user.create({
    data: {
      id: '4d3b8c10-fa6b-444b-bcf2-3a4ef3175133',
      username: 'fashionadmin',
      email: process.env.FASHION_ADMIN_EMAIL!,
      password: fashionAdminPassword,
      roleId: fashionAdminRole.id,
      fullName: 'Fashion Admin',
      phoneNumber: '0123456787',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  // Tạo tài khoản beauty & health admin mặc định
  const beautyHealthAdminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.BEAUTY_HEALTH_ADMIN,
    },
  })
  const beautyHealthAdminPassword = await hashPassword(process.env.BEAUTY_HEALTH_ADMIN_PASSWORD!)
  const beautyHealthAdmin = await prisma.user.create({
    data: {
      id: 'b56906e3-bf87-4c30-abc1-82229ef24cb7',
      username: 'beautyhealthadmin',
      email: process.env.BEAUTY_HEALTH_ADMIN_EMAIL!,
      password: beautyHealthAdminPassword,
      roleId: beautyHealthAdminRole.id,
      fullName: 'Beauty & Health Admin',
      phoneNumber: '0123456786',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  // Tạo tài khoản tech admin mặc định
  const techAdminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.TECH_ADMIN,
    },
  })
  const techAdminPassword = await hashPassword(process.env.TECH_ADMIN_PASSWORD!)
  const techAdmin = await prisma.user.create({
    data: {
      id: 'f42d99a6-1e96-4d04-a087-ce14875ba1c7',
      username: 'techadmin',
      email: process.env.TECH_ADMIN_EMAIL!,
      password: techAdminPassword,
      roleId: techAdminRole.id,
      fullName: 'Tech Admin',
      phoneNumber: '0123456785',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  // Tạo tài khoản home & lifestyle admin mặc định
  const homeLifestyleAdminRole = await prisma.role.findFirstOrThrow({
    where: { 
      name: RoleName.HOME_LIFESTYLE_ADMIN,
    },
  })
  const homeLifestyleAdminPassword = await hashPassword(process.env.HOME_LIFESTYLE_ADMIN_PASSWORD!)
  const homeLifestyleAdmin = await prisma.user.create({
    data: {
      id: 'aa51f1a6-f338-42ad-8b2c-6cfb02b65d56',
      username: 'homelifestyleadmin',
      email: process.env.HOME_LIFESTYLE_ADMIN_EMAIL!,
      password: homeLifestyleAdminPassword,
      roleId: homeLifestyleAdminRole.id,
      fullName: 'Home & Lifestyle Admin',
      phoneNumber: '0123456784',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  // Tạo tài khoản leisure admin mặc định
  const leisureAdminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.LEISURE_ADMIN,
    },
  })
  const leisureAdminPassword = await hashPassword(process.env.LEISURE_ADMIN_PASSWORD!)
  const leisureAdmin = await prisma.user.create({
    data: {
      id: 'bdd23524-a9c4-481f-bad4-a733bc39e597',
      username: 'leisureadmin',
      email: process.env.LEISURE_ADMIN_EMAIL!,
      password: leisureAdminPassword,
      roleId: leisureAdminRole.id,
      fullName: 'Leisure Admin',
      phoneNumber: '0123456783',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  // Tạo tài khoản food & beverage admin mặc định
  const foodBeverageAdminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.FOOD_BEVERAGE_ADMIN,
    },
  })
  const foodBeverageAdminPassword = await hashPassword(process.env.FOOD_BEVERAGE_ADMIN_PASSWORD!)
  const foodBeverageAdmin = await prisma.user.create({
    data: {
      id: 'e33f99d6-17b5-4c8e-8f83-a01c50032d18',
      username: 'foodbeverageadmin',
      email: process.env.FOOD_BEVERAGE_ADMIN_EMAIL!,
      password: foodBeverageAdminPassword,
      roleId: foodBeverageAdminRole.id,
      fullName: 'Food & Beverage Admin',
      phoneNumber: '0123456782',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  // Tạo tài khoản shipper mặc định
  const shipperRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.SHIPPER,
    },
  })
  const shipperPassword = await hashPassword(process.env.SHIPPER_PASSWORD!)
  const shipper = await prisma.user.create({
    data: {
      id: '06e07f88-e3e8-45ca-9725-31cd5690d9e2',
      username: 'shipper',
      email: process.env.SHIPPER_EMAIL!,
      password: shipperPassword,
      roleId: shipperRole.id,
      fullName: 'Shipper',
      phoneNumber: '0123456781',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  // Tạo tài khoản warehouse scanner mặc định
  const warehouseScannerRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.WAREHOUSE_SCANNER,
    },
  })
  const warehouseScannerPassword = await hashPassword(process.env.WAREHOUSE_SCANNER_PASSWORD!)
  const warehouseScanner1 = await prisma.user.create({
    data: {
      id: '4d0932c1-fe92-4089-b8b4-d6aa8297332c',
      username: 'warehousescanner1',
      email: process.env.WAREHOUSE_SCANNER_1_EMAIL!,
      password: warehouseScannerPassword,
      roleId: warehouseScannerRole.id,
      fullName: 'Warehouse Scanner 1',
      phoneNumber: '0123456765',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  const warehouseScanner2 = await prisma.user.create({
    data: {
      id: '0dc5fb6e-5137-4bb0-af24-0bc394e1ccf9',
      username: 'warehousescanner2',
      email: process.env.WAREHOUSE_SCANNER_2_EMAIL!,
      password: warehouseScannerPassword,
      roleId: warehouseScannerRole.id,
      fullName: 'Warehouse Scanner 2',
      phoneNumber: '0123456756',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  const warehouseScanner3 = await prisma.user.create({
    data: {
      id: '7f6cd927-5c21-4df6-ab13-bf2fa70587bc',
      username: 'warehousescanner3',
      email: process.env.WAREHOUSE_SCANNER_3_EMAIL!,
      password: warehouseScannerPassword,
      roleId: warehouseScannerRole.id,
      fullName: 'Warehouse Scanner 3',
      phoneNumber: '0123456745',
      gender: Gender.MALE,
      dob: new Date(),
      emailVerified: true,
    },
  })

  return {
    createdRoleCount: roles.count,
    superAdmin,
    customerAdmin,
    fashionAdmin,
    beautyHealthAdmin,
    techAdmin,
    homeLifestyleAdmin,
    leisureAdmin,
    foodBeverageAdmin,
    shipper,
    warehouseScanner1,
    warehouseScanner2,
    warehouseScanner3,
  }
}

main()
  .then(({ 
    createdRoleCount, 
    superAdmin, 
    customerAdmin, 
    fashionAdmin, 
    beautyHealthAdmin, 
    techAdmin, 
    homeLifestyleAdmin, 
    leisureAdmin, 
    foodBeverageAdmin, 
    shipper, 
    warehouseScanner1,
    warehouseScanner2,
    warehouseScanner3,
  }) => {
    console.log(`Created ${createdRoleCount} roles`)
    console.log(`Created super admin user: ${superAdmin.email}`)
    console.log(`Created customer admin user: ${customerAdmin.email}`)
    console.log(`Created fashion admin user: ${fashionAdmin.email}`)
    console.log(`Created beauty & health admin user: ${beautyHealthAdmin.email}`)
    console.log(`Created tech admin user: ${techAdmin.email}`)
    console.log(`Created home & lifestyle admin user: ${homeLifestyleAdmin.email}`)
    console.log(`Created leisure admin user: ${leisureAdmin.email}`)
    console.log(`Created food & beverage admin user: ${foodBeverageAdmin.email}`)
    console.log(`Created shipper user: ${shipper.email}`)
    console.log(`Created warehouse scanner user: ${warehouseScanner1.email}`)
    console.log(`Created warehouse scanner user: ${warehouseScanner2.email}`)
    console.log(`Created warehouse scanner user: ${warehouseScanner3.email}`)
  })
  .catch(console.error)
