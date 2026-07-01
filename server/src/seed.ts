import { faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs';
import { initDb, getDb } from './db';

const NATIONALITIES = [
  'American', 'British', 'Canadian', 'Australian', 'German',
  'French', 'Italian', 'Spanish', 'Japanese', 'Chinese',
  'Indian', 'Brazilian', 'Mexican', 'South Korean', 'Dutch',
  'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Swiss',
  'Austrian', 'Belgian', 'Portuguese', 'Irish', 'Polish',
  'Czech', 'Greek', 'Turkish', 'Argentinian', 'Colombian',
];

const HOBBIES = [
  'Reading', 'Gaming', 'Cooking', 'Photography', 'Hiking',
  'Swimming', 'Cycling', 'Painting', 'Gardening', 'Yoga',
  'Running', 'Chess', 'Dancing', 'Fishing', 'Knitting',
  'Woodworking', 'Surfing', 'Camping', 'Bird Watching', 'Writing',
  'Pottery', 'Archery', 'Skateboarding', 'Rock Climbing', 'Meditation',
  'Piano', 'Guitar', 'Singing', 'Drawing', 'Sculpting',
  'Tennis', 'Basketball', 'Soccer', 'Volleyball', 'Badminton',
  'Table Tennis', 'Martial Arts', 'Boxing', 'Fencing', 'Rowing',
  'Astronomy', 'Board Games', 'Origami', 'Calligraphy', 'Baking',
  'Wine Tasting', 'Traveling', 'Scuba Diving', 'Skiing', 'Snowboarding',
];

const USER_COUNT = 5000;

function seed() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = process.env.DB_PATH || path.join(dataDir, 'users.db');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  initDb();
  const db = getDb();

  console.log('Seeding hobbies...');
  const insertHobby = db.prepare('INSERT INTO hobbies (name) VALUES (?)');
  const insertHobbies = db.transaction(() => {
    for (const hobby of HOBBIES) {
      insertHobby.run(hobby);
    }
  });
  insertHobbies();

  console.log(`Seeding ${USER_COUNT} users...`);
  const insertUser = db.prepare(
    'INSERT INTO users (avatar, first_name, last_name, age, nationality) VALUES (?, ?, ?, ?, ?)'
  );
  const insertUserHobby = db.prepare(
    'INSERT INTO user_hobbies (user_id, hobby_id) VALUES (?, ?)'
  );

  const insertUsers = db.transaction(() => {
    for (let i = 0; i < USER_COUNT; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const age = faker.number.int({ min: 18, max: 85 });
      const nationality = NATIONALITIES[faker.number.int({ min: 0, max: NATIONALITIES.length - 1 })];
      const avatar = `https://i.pravatar.cc/150?u=${i + 1}`;

      const result = insertUser.run(avatar, firstName, lastName, age, nationality);
      const userId = result.lastInsertRowid;

      const hobbyCount = faker.number.int({ min: 0, max: 10 });
      const shuffled = [...HOBBIES].sort(() => Math.random() - 0.5);
      const userHobbies = shuffled.slice(0, hobbyCount);

      for (const hobby of userHobbies) {
        const hobbyId = HOBBIES.indexOf(hobby) + 1;
        insertUserHobby.run(userId, hobbyId);
      }
    }
  });
  insertUsers();

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const hobbyCount = db.prepare('SELECT COUNT(*) as count FROM hobbies').get() as { count: number };
  const linkCount = db.prepare('SELECT COUNT(*) as count FROM user_hobbies').get() as { count: number };

  console.log(`Done! Created ${userCount.count} users, ${hobbyCount.count} hobbies, ${linkCount.count} user-hobby links.`);
}

seed();
