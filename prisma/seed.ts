import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Property demo
  const property = await prisma.property.upsert({
    where: { id: 'prop-001' },
    update: {},
    create: {
      id: 'prop-001',
      name: 'Conjunto Residencial Alcalá',
      address: 'Dg. 44 #33b - 104',
      city: 'Bello',
      phone: '601-00000000',
      email: 'admin@alcala.com',
    },
  });
  console.log('Property created:', property.name);

  // Block
  const block = await prisma.residentialBlock.upsert({
    where: { id: 'torre-2A' },
    update: {},
    create: {
      id: 'torre-2A',
      name: 'Torre 2A',
      propertyId: property.id,
    },
  });

  // Units
  const unit101 = await prisma.residentialUnit.upsert({
    where: { id: 'unit-101-001' },
    update: {},
    create: {
      id: 'unit-101-001',
      number: '101',
      floor: 1,
      isOccupied: true,
      propertyId: property.id,
      blockId: block.id,
    },
  });

  const unit202 = await prisma.residentialUnit.upsert({
    where: { id: 'unit-202-001' },
    update: {},
    create: {
      id: 'unit-202-001',
      number: '202',
      floor: 2,
      isOccupied: true,
      propertyId: property.id,
      blockId: block.id,
    },
  });

  console.log('Units created');

  const saltRounds = 10;

  // SUPER_ADMIN
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@janora.com' },
    update: {},
    create: {
      email: 'superadmin@janora.com',
      password: await bcrypt.hash('Admin123!', saltRounds),
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log('SUPER_ADMIN:', superAdmin.email);

  // PROPERTY_ADMIN
  const propertyAdmin = await prisma.user.upsert({
    where: { email: 'admin@lospinos.com' },
    update: {},
    create: {
      email: 'admin@lospinos.com',
      password: await bcrypt.hash('Admin123!', saltRounds),
      firstName: 'Carlos',
      lastName: 'Martínez',
      phone: '3001234567',
      role: Role.PROPERTY_ADMIN,
      propertyId: property.id,
    },
  });
  console.log('PROPERTY_ADMIN:', propertyAdmin.email);

  // SECURITY_GUARD
  const guard = await prisma.user.upsert({
    where: { email: 'porteria@lospinos.com' },
    update: {},
    create: {
      email: 'porteria@lospinos.com',
      password: await bcrypt.hash('Guard123!', saltRounds),
      firstName: 'Jorge',
      lastName: 'Pérez',
      phone: '3009876543',
      role: Role.SECURITY_GUARD,
      propertyId: property.id,
    },
  });
  console.log('SECURITY_GUARD:', guard.email);

  // RESIDENT user
  const residentUser = await prisma.user.upsert({
    where: { email: 'residente@lospinos.com' },
    update: {},
    create: {
      email: 'residente@lospinos.com',
      password: await bcrypt.hash('Resident123!', saltRounds),
      firstName: 'Ana',
      lastName: 'García',
      phone: '3151234567',
      role: Role.RESIDENT,
      propertyId: property.id,
    },
  });

  // Resident record
  const resident = await prisma.resident.upsert({
    where: { userId: residentUser.id },
    update: {},
    create: {
      firstName: 'Carlos',
      lastName: 'García',
      email: residentUser.email,
      phone: '3151234567',
      userId: residentUser.id,
      unitId: unit101.id,
      propertyId: property.id,
    },
  });
  console.log('RESIDENT:', residentUser.email);

  // Second resident
  const residentUser2 = await prisma.user.upsert({
    where: { email: 'residente2@lospinos.com' },
    update: {},
    create: {
      email: 'residente2@lospinos.com',
      password: await bcrypt.hash('Resident123!', saltRounds),
      firstName: 'Luis',
      lastName: 'Rodríguez',
      phone: '3209876543',
      role: Role.RESIDENT,
      propertyId: property.id,
    },
  });

  await prisma.resident.upsert({
    where: { userId: residentUser2.id },
    update: {},
    create: {
      firstName: 'Luis',
      lastName: 'Rodríguez',
      email: residentUser2.email,
      phone: '3209876543',
      userId: residentUser2.id,
      unitId: unit202.id,
      propertyId: property.id,
    },
  });

  // Pet for resident
  await prisma.pet.upsert({
    where: { id: 'pet-001' },
    update: {},
    create: {
      id: 'pet-001',
      name: 'Max',
      breed: 'Labrador',
      color: 'Dorado',
      residentId: resident.id,
      propertyId: property.id,
    },
  });

  // Vehicle for resident
  await prisma.vehicle.upsert({
    where: { id: 'vehicle-001' },
    update: {},
    create: {
      id: 'vehicle-001',
      plate: 'ABC123',
      brand: 'Toyota',
      model: 'Corolla',
      color: 'Blanco',
      type: 'CAR',
      residentId: resident.id,
      propertyId: property.id,
    },
  });

  console.log('Seed completed successfully!');
  console.log('\nCredentials:');
  console.log('  SUPER_ADMIN   -> superadmin@janora.com  / Admin123!');
  console.log('  PROPERTY_ADMIN-> admin@lospinos.com      / Admin123!');
  console.log('  SECURITY_GUARD-> porteria@lospinos.com   / Guard123!');
  console.log('  RESIDENT      -> residente@lospinos.com  / Resident123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
