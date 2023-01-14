import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const posts = [
    {
      title: "My First Post", 
      slug: "my-first-post", 
      markdown: `# This is my first post
        ### This is markdown text
        ---
        Hopefully it works!
        -- First post
      
      `
    },
    {
      title: "My Second Post", 
      slug: "my-second-post", 
      markdown: `# This is my scond post
        ### This is markdown text
        ---
        Hopefully it works!
        -- Second post
      
      `
    },
    {
      title: "My Third Post", 
      slug: "my-third-post", 
      markdown: `# This is my third post
        ### This is markdown text
        ---
        Hopefully it works!
        -- Third post
      
      `
    }
  ];

  // Pusg to primsa every post
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
