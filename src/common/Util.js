const ID = require('nanoid');

async function uuid() {
  const nanoid = await ID.customAlphabet('abcdef12344', 10);
  return nanoid();
}

module.exports = {
  uuid,
};
