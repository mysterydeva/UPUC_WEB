import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
    url: "file:dev.db"
});

const prisma = new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
});

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default business
  const business = await prisma.business.upsert({
    where: { id: 'default-business-1' },
    update: {},
    create: {
      id: 'default-business-1',
      name: 'UPUC Windows & Doors',
      gstin: '29AAAPL1234C1ZV',
      address: '123 Industrial Area, Bangalore - 560001',
      phone: '+91 80 1234 5678',
      email: 'info@upuc.com',
      currency: 'INR',
    },
  });

  console.log('✅ Business created:', business.name);

  // Create sample inventory items
  const inventoryItems = [
    { name: 'Aluminum Profile - 6ft', category: 'Profile', stock: 150, unit: 'Pcs', minStock: 20, price: 850 },
    { name: 'Tempered Glass - 6mm', category: 'Glass', stock: 75, unit: 'SqFt', minStock: 15, price: 120 },
    { name: 'UPVC Handle Set', category: 'Hardware', stock: 200, unit: 'Sets', minStock: 25, price: 180 },
    { name: 'EPDM Gasket', category: 'Hardware', stock: 500, unit: 'Meters', minStock: 50, price: 25 },
    { name: 'Sliding Wheel', category: 'Hardware', stock: 300, unit: 'Pcs', minStock: 40, price: 45 },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: {
        ...item,
        businessId: business.id,
        status: item.stock > item.minStock ? 'In Stock' : 'Low Stock',
      },
    });
  }

  console.log('✅ Inventory items created');

  // Create sample leads
  const leads = [
    {
      leadId: 'LD-2024-001',
      clientName: 'Rajesh Kumar',
      contact: '+91 98450 12345',
      projectType: 'Residential',
      status: 'Enquiry',
      source: 'Reference',
      businessId: business.id,
    },
    {
      leadId: 'LD-2024-002',
      clientName: 'Sneha Reddy',
      contact: '+91 98450 67890',
      projectType: 'Commercial',
      status: 'Measured',
      source: 'Social',
      businessId: business.id,
    },
    {
      leadId: 'LD-2024-003',
      clientName: 'Buildwell Developers',
      contact: '+91 80 2345 6789',
      projectType: 'Commercial',
      status: 'Quoted',
      source: 'Direct',
      businessId: business.id,
    },
  ];

  for (const lead of leads) {
    await prisma.lead.upsert({
      where: { leadId: lead.leadId },
      update: lead,
      create: lead,
    });
  }

  console.log('✅ Sample leads created');

  // Store created leads for reference
  const createdLeads = await prisma.lead.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  // Create sample parties
  const parties = [
    { name: 'Build Corp India', mobile: '+91 80 1234 5678', gstin: '29AAAPL5678B2ZV', businessId: business.id },
    { name: 'Private Residence', mobile: '+91 98450 1111', businessId: business.id },
    { name: 'Innovate Hub', mobile: '+91 80 9876 5432', gstin: '29AAAPL9012C3ZV', businessId: business.id },
  ];

  for (const party of parties) {
    await prisma.party.create({ data: party });
  }

  console.log('✅ Sample parties created');

  // Create sample quotations
  const quotations = [
    {
      quotationId: 'QTN-2024-001',
      leadId: createdLeads[0].id, // Link to first lead
      client: 'Rajesh Kumar',
      amount: 53100,
      status: 'Sent',
      date: new Date('2024-03-01'),
      validUntil: new Date('2024-03-15'),
    },
    {
      quotationId: 'QTN-2024-002',
      leadId: createdLeads[1].id, // Link to second lead
      client: 'Sneha Reddy',
      amount: 142500,
      status: 'Approved',
      date: new Date('2024-02-28'),
      validUntil: new Date('2024-03-14'),
    },
    {
      quotationId: 'QTN-2024-003',
      leadId: createdLeads[2].id, // Link to third lead
      client: 'Buildwell Developers',
      amount: 983000,
      status: 'Draft',
      date: new Date('2024-02-25'),
      validUntil: new Date('2024-03-11'),
    },
  ];

  for (const quotation of quotations) {
    await prisma.quotation.upsert({
      where: { quotationId: quotation.quotationId },
      update: quotation,
      create: quotation,
    });
  }

  console.log('✅ Sample quotations created');

  // Store created quotations for reference
  const createdQuotations = await prisma.quotation.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  // Create sample job orders
  const jobOrders = [
    {
      jobOrderId: 'JO-2024-001',
      quotationId: createdQuotations[1].id, // Link to approved quotation
      name: 'Sneha Reddy - UPVC Windows',
      client: 'Sneha Reddy',
      progress: 25,
      deadline: new Date('2024-04-15'),
    },
    {
      jobOrderId: 'JO-2024-002',
      quotationId: createdQuotations[0].id, // Link to sent quotation
      name: 'Rajesh Kumar - Sliding Doors',
      client: 'Rajesh Kumar',
      progress: 60,
      deadline: new Date('2024-03-30'),
    },
  ];

  for (const jobOrder of jobOrders) {
    await prisma.jobOrder.upsert({
      where: { jobOrderId: jobOrder.jobOrderId },
      update: jobOrder,
      create: jobOrder,
    });
  }

  console.log('✅ Sample job orders created');

  // Create sample expenses
  const expenses = [
    {
      category: 'Materials',
      description: 'Aluminum Profiles Purchase',
      amount: 25000,
      date: new Date('2024-02-15'),
      businessId: business.id,
    },
    {
      category: 'Labor',
      description: 'Installation Team Wages',
      amount: 15000,
      date: new Date('2024-02-20'),
      businessId: business.id,
    },
    {
      category: 'Transport',
      description: 'Material Delivery Charges',
      amount: 3500,
      date: new Date('2024-02-22'),
      businessId: business.id,
    },
  ];

  for (const expense of expenses) {
    await prisma.expense.create({ data: expense });
  }

  console.log('✅ Sample expenses created');

  // Create sample vouchers
  const vouchers = [
    {
      voucherId: 'VOU-2024-001',
      type: 'Payment',
      amount: 50000,
      date: new Date('2024-02-10'),
      status: 'Cleared',
      businessId: business.id,
    },
    {
      voucherId: 'VOU-2024-002',
      type: 'Receipt',
      amount: 75000,
      date: new Date('2024-02-18'),
      status: 'Cleared',
      businessId: business.id,
    },
    {
      voucherId: 'VOU-2024-003',
      type: 'Journal',
      amount: 12000,
      date: new Date('2024-02-25'),
      status: 'Pending',
      businessId: business.id,
    },
  ];

  for (const voucher of vouchers) {
    await prisma.voucher.upsert({
      where: { voucherId: voucher.voucherId },
      update: voucher,
      create: voucher,
    });
  }

  console.log('✅ Sample vouchers created');

  // Create sample warehouses
  const warehouses = [
    {
      name: 'Main Warehouse',
      location: 'Industrial Area, Bangalore',
      businessId: business.id,
    },
    {
      name: 'Secondary Storage',
      location: 'Whitefield, Bangalore',
      businessId: business.id,
    },
  ];

  for (const warehouse of warehouses) {
    await prisma.warehouse.create({ data: warehouse });
  }

  console.log('✅ Sample warehouses created');

  // Create sample invoices
  const invoices = [
    {
      invoiceId: 'INV-2024-001',
      client: 'Build Corp India',
      subTotal: 425000,
      taxRate: 18,
      taxAmount: 76500,
      discount: 0,
      totalAmount: 501500,
      gstType: 'CGST_SGST',
      status: 'Paid',
      method: 'Bank Transfer',
      dueDate: new Date('2024-03-15'),
      businessId: business.id,
    },
    {
      invoiceId: 'INV-2024-002',
      client: 'Private Residence',
      subTotal: 112000,
      taxRate: 18,
      taxAmount: 20160,
      discount: 0,
      totalAmount: 132160,
      gstType: 'CGST_SGST',
      status: 'Pending',
      method: 'Cheque',
      dueDate: new Date('2024-03-20'),
      businessId: business.id,
    },
  ];

  const createdInvoices = [];
  for (const invoice of invoices) {
    const created = await prisma.invoice.upsert({
      where: { invoiceId: invoice.invoiceId },
      update: invoice,
      create: invoice,
    });
    createdInvoices.push(created);
  }

  console.log('✅ Sample invoices created');

  // Create bank account
  const bankAccount = await prisma.bankAccount.create({
    data: {
      name: 'HDFC Current Account',
      accountNo: '50200012345678',
      ifscCode: 'HDFC0001234',
      branchName: 'Indiranagar, Bangalore',
      balance: 2500000,
      businessId: business.id,
    },
  });

  console.log('✅ Bank account created');

  // Create sample transactions
  const transactions = [
    {
      type: 'Payment In',
      amount: 501500,
      reference: 'UTR123456789',
      bankAccountId: bankAccount.id,
      businessId: business.id,
      linkedInvoiceId: createdInvoices[0].id,
    },
    {
      type: 'Payment Out',
      amount: 25000,
      reference: 'Vendor Payment',
      bankAccountId: bankAccount.id,
      businessId: business.id,
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
  }

  console.log('✅ Sample transactions created');

  // Update bank balance
  await prisma.bankAccount.update({
    where: { id: bankAccount.id },
    data: {
      balance: {
        increment: transactions[0].amount - transactions[1].amount,
      },
    },
  });

  console.log('✅ Bank balance updated');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
