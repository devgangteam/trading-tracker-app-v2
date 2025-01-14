import * as bcrypt from 'bcrypt';

export async function hashPassword(rawPassword: string) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(rawPassword, salt);
}

export async function comparePassword(
  rawPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(rawPassword, hashedPassword);
}
