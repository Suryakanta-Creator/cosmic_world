export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, never store plain text. We simulate hashing here.
  role: 'user' | 'admin';
  avatar: string;
  joinedAt: string;
}

const DB_KEY = 'cosmic_users_db';

// Seed initial Admin user if not present
const seedDatabase = () => {
  const usersStr = localStorage.getItem(DB_KEY);
  let users: User[] = usersStr ? JSON.parse(usersStr) : [];
  
  // Check if admin already exists to avoid duplicates or overwriting
  if (!users.find(u => u.email === 'admin@cosmicwatch.com')) {
    const adminUser: User = {
      id: 'admin-001',
      name: 'Commander Sheppard',
      email: 'admin@cosmicwatch.com',
      password: 'admin123', // Simulation only
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      joinedAt: new Date().toISOString()
    };
    users.push(adminUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    console.log("Database seeded with Admin user.");
  }
};

export const db = {
  init: () => seedDatabase(),

  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const usersStr = localStorage.getItem(DB_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('User not found. Please register first.');
    }

    if (user.password !== password) {
       throw new Error('Invalid password provided.');
    }

    // Return user without password
    const { password: _, ...safeUser } = user;
    return safeUser as User;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const usersStr = localStorage.getItem(DB_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already exists with this email.');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role: 'user', // Default role
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      joinedAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));

    const { password: _, ...safeUser } = newUser;
    return safeUser as User;
  },

  // ADMIN ONLY FUNCTION
  getAllUsers: async (adminUser: User): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (adminUser.role !== 'admin') {
      throw new Error('Unauthorized: Access denied. Admin clearance required.');
    }

    const usersStr = localStorage.getItem(DB_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    // Return all users (sanitized)
    return users.map(({ password, ...u }) => u as User);
  }
};

// Initialize on load
db.init();