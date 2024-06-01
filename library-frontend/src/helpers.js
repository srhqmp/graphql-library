export const updateCache = (cache, query, addedBook) => {
  const uniqueByTitle = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return { allBooks: uniqueByTitle(allBooks.concat(addedBook)) };
  });
};
