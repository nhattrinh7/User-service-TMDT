import { PrismaService } from '~/infrastructure/database/prisma/prisma.service'
import { RoleName } from '~/common/constants/constant'
import { hashPassword } from '~/common/utils/bcrypt.util'
import { v4 as uuidv4 } from 'uuid'
import { Gender } from '~/domain/enums/user.enum'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

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
      id: uuidv4(),
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

  // Tạo tài khoản customer admin mặc định
  const customerAdminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.CUSTOMER_ADMIN,
    },
  })
  const customerAdminPassword = await hashPassword(process.env.CUSTOMER_ADMIN_PASSWORD!)
  const customerAdmin = await prisma.user.create({
    data: {
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
    foodBeverageAdmin 
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
  })
  .catch(console.error)