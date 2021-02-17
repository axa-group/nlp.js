const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;

const isEmpty = (value) => !value || value === '';

if (
  isEmpty(PAGE_ID) ||
  isEmpty(ACCESS_TOKEN) ||
  isEmpty(APP_SECRET) ||
  isEmpty(VERIFY_TOKEN)
) {
  throw new Error('Missing Fb credentials');
}
const STICKERS_MAP = {
  369239263222822: 'ok',
  369239343222814: 'ok',
  369239383222810: 'ok!',
};

module.exports = {
  VERIFY_TOKEN,
  APP_SECRET,
  ACCESS_TOKEN,
  PAGE_ID,
  STICKERS_MAP,
};
