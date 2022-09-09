export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkey.',
    signOptions: { expiresIn: `${process.env.EXPIRES_IN || 60}s` },
  },
  maxAge: +(process.env.EXPIRES_IN || 60) * 1000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3001',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3002',
});
