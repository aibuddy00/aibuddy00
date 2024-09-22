import { client } from '../sanity/lib/client';

export async function loginUser(email: string, password: string) {
  const result = await client.fetch(
    `*[_type == "user" && email == $email][0]{
      _id,
      name,
      email,
      password
    }`,
    { email }
  );
  
  if (result && result.password === password) { // In a real app, use proper password hashing
    return result;
  } else {
    throw new Error('Invalid credentials');
  }
}

export async function signupUser(name: string, email: string, password: string) {
  // Check if user already exists
  const existingUser = await client.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email }
  );

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const newUser = {
    _type: 'user',
    name,
    email,
    password, // In a real app, never store plain text passwords
  };

  return await client.create(newUser);
}