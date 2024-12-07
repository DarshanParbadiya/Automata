import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function seedActions() {
  try {
    await db.availableAction.createMany({
      data: [
        {
          name: 'Google Docs',
          image: 'https://cdn-icons-png.flaticon.com/512/5968/5968517.png',
        },
        {
          name: 'WhatsApp',
          image:
            'https://i.pinimg.com/474x/f7/1f/fb/f71ffb7ad7db43ccc7b1466de418f254.jpg',
        },
      ],
    });
  } catch (error) {
    console.error('Error while seeding Actions');
    throw error;
  }
}
async function seedTriggers() {
  try {
    await db.availableAction.createMany({
      data: [
        {
          name: 'webhook2',
          image:
            'https://creazilla-store.fra1.digitaloceanspaces.com/icons/3211689/webhook-icon-md.png',
        },
      ],
    });
  } catch (error) {
    console.error('Error while seeding Actions');
    throw error;
  }
}

async function seedDatabase() {
  try {
    await seedActions();
    await seedTriggers();
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

seedDatabase().catch((error) => {
  console.error('An unexpected error occurred during seeding:', error);
  process.exit(1);
});
