import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
});