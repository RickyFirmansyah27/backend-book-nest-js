import { QueryFindMembers } from './user.query'; // Gantilah 'your-module' dengan path yang sesuai

describe('QueryFindMembers', () => {
  it('should create a valid FindOptions object', () => {
    const where = { /* your where condition */ };
    const order = [ /* your order condition */ ];
    const pagination = {
      size: 10,
      page: 1,
    };

    const findOptions = QueryFindMembers(where, order, pagination);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan
    expect(findOptions).toEqual({
      where,
      order,
      limit: pagination.size,
      offset: pagination.page * pagination.size,
      include: [],
    });
  });

  it('should handle null pagination', () => {
    const where = { /* your where condition */ };
    const order = [ /* your order condition */ ];
    const pagination = null;

    const findOptions = QueryFindMembers(where, order, pagination);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan (pagination.size dan pagination.page harus null)
    expect(findOptions).toEqual({
      where,
      order,
      limit: null,
      offset: null,
      include: [],
    });
  });
});
