const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create/Update base user (using the email from .env or common dev email)
  const devEmail = "dev@example.com"; // Adjust if needed
  
  const user = await prisma.user.upsert({
    where: { email: devEmail },
    update: { xp: 1250 },
    create: {
      email: devEmail,
      name: "Dev Learner",
      password: "password123", // Real apps should hash this
      role: "STUDENT",
      xp: 1250
    }
  });

  // Create base lessons
  const lessons = await Promise.all([
    prisma.lesson.upsert({
      where: { id: 'math-1' },
      update: {},
      create: {
        id: 'math-1',
        title: "Algebraic Equations",
        subject: "Mathematics",
        duration: 30,
        description: "Master basic algebraic equations."
      }
    }),
    prisma.lesson.upsert({
      where: { id: 'sci-1' },
      update: {},
      create: {
        id: 'sci-1',
        title: "Chemical Bonding",
        subject: "Science",
        duration: 45,
        description: "Introduction to molecular structures."
      }
    }),
    prisma.lesson.upsert({
      where: { id: 'eng-1' },
      update: {},
      create: {
        id: 'eng-1',
        title: "Grammar & Punctuation",
        subject: "English",
        duration: 20,
        description: "Perfecting your writing skills."
      }
    })
  ]);

  // Create progress
  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: 'math-1' } },
    update: { completed: false },
    create: { userId: user.id, lessonId: 'math-1', completed: false }
  });

  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: 'eng-1' } },
    update: { completed: true },
    create: { userId: user.id, lessonId: 'eng-1', completed: true }
  });

  // Create activities
  await prisma.activity.createMany({
    data: [
      { userId: user.id, type: "COMPLETED", content: "Math: Completed Chapter 2 Quiz" },
      { userId: user.id, type: "DOWNLOADED", content: "English: Downloaded 'Grammar Basics'" },
      { userId: user.id, type: "STARTED", content: "History: Started 'Ancient Rome'" }
    ]
  });

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
