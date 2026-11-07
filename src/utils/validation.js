const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim() !== '';
};

const isValidIsoDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const isValidBirthYear = (value) => {
  return Number.isInteger(value) && value >= 1 && value <= new Date().getFullYear();
};

// Returns a clean author object, or null if the body is missing or invalid.
// Only the documented fields are kept; extra fields are ignored.
const buildAuthor = (body, { requireId }) => {
  const { id, name, birthYear } = body ?? {};

  if (requireId && !isNonEmptyString(id)) {
    return null;
  }

  if (!isNonEmptyString(name) || !isValidBirthYear(birthYear)) {
    return null;
  }

  const author = { name: name.trim(), birthYear };

  return requireId ? { id: id.trim(), ...author } : author;
};

// Returns a clean book object, or null if the body is missing or invalid.
const buildBook = (body, { requireId }) => {
  const { id, authorId, title, publicationDate } = body ?? {};

  if (requireId && !isNonEmptyString(id)) {
    return null;
  }

  if (!isNonEmptyString(authorId) || !isNonEmptyString(title) || !isValidIsoDate(publicationDate)) {
    return null;
  }

  const book = {
    authorId: authorId.trim(),
    title: title.trim(),
    publicationDate
  };

  return requireId ? { id: id.trim(), ...book } : book;
};

export { buildAuthor, buildBook };
