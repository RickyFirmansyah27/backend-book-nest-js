import {
  QueryParamsUser,
  ToSeqWhere,
  ToSeqAttributes,
  ToSortUser,
} from './user.params';
import { Op } from 'sequelize'; 

interface CustomQueryParamsUser extends QueryParamsUser {
  onYear?: string;
  name?: string;
  email?: string;
  gender?: string;
}

describe('Query Parameters', () => {
  it('should create Sequelize WHERE clause from QueryParamsUser', () => {
    const queryParams: QueryParamsUser = {
      mode: 'table',
      id: '2e6b5214-f710-4b7c-a45b-9fbda7d3b07e',
      filter: 'eyJhZ2UiOiAyM30=', 
      page: 1,
      size: 10,
      sort: 'eyJhZ2UiOiJkZXNjIn0=',
      select:'' , // Sesuaikan dengan atribut yang Anda inginkan
      download: false,
    };

    const whereClause = ToSeqWhere(queryParams);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan
    expect(whereClause).toEqual({
      id: "2e6b5214-f710-4b7c-a45b-9fbda7d3b07e",
      age: 23,
      // Sesuaikan dengan nilai id yang Anda berikan
      // Tambahkan properti lain sesuai dengan filter yang Anda berikan
    });
  });

  it('should handle null filter in Sequelize WHERE clause', () => {
    const queryParams: QueryParamsUser = {
      mode: 'table',
      id: '1',
      filter: '', 
      page: 1,
      size: 10,
      sort: '',
      select:'',
      download: false,
    };


    const whereClause = ToSeqWhere(queryParams);

    // Memeriksa apakah hasilnya sesuai dengan yang diharapkan (filter harus null)
    expect(whereClause).toEqual({
      id:'1',
      // Tambahkan properti lain sesuai dengan filter yang Anda berikan
    });
  });

    it('should create Sequelize SELECT attributes from QueryParamsDto', () => {
      const queryParams: QueryParamsUser = {
        mode: 'list',
        id: '',
        filter: '',
        page: 1,
        size: 10,
        sort: '',
        select: 'ewogICJhZ2UiOiAxOAp9Cg==', // Sesuaikan dengan atribut yang Anda inginkan
        download: false,
      };

      const selectAttributes = ToSeqAttributes(queryParams);

      // Memeriksa apakah hasilnya sesuai dengan yang diharapkan
      expect(selectAttributes).toEqual(['age']); // Sesuaikan dengan atribut yang Anda harapkan dalam hasil
  });

    it('should handle null SORT clause', () => {
      const base64SortString = null; // Sort null

      const sortClause = ToSortUser(base64SortString);

      // Memeriksa apakah hasilnya sesuai dengan yang diharapkan (sortClause harus null)
      expect(sortClause).toBeNull();
    });

    it('should return null for empty string input', () => {
      const result = ToSortUser('');
      expect(result).toBeNull();
    });

    it('should parse valid base64 input and return an array with a SortField array', () => {
      // Contoh string JSON yang diubah menjadi base64
      const base64Input = 'eyJhZ2UiOiJhc2MifQ==';

      const expectedResult = [['age','asc']];

      const result = ToSortUser(base64Input);
      expect(result).toEqual(expectedResult);
    });

  //to seqwhere
  it('should correctly filter by age range, name, and email', () => {
    const queryParams: CustomQueryParamsUser = {
      id: undefined,
      onYear: '22,23',
      name: 'Ricky',
      email: 'Ricky, Admin',
      gender: undefined,
      filter: undefined,
      page: 1,
      size: 10,
      sort: '',
      select:'' , 
      mode:'list',
      download: false,
    };

    const expectedResult = {
      age: {
        [Op.between]: ['22', '23'],
      },
      name: {
        [Op.like]: '%Ricky%',
      },
      email: {
        [Op.or]: [
          { [Op.like]: '%Ricky%' },
          { [Op.like]: '%Admin%' },
        ],
      },
    };

    const result = ToSeqWhere(queryParams);
    expect(result).toEqual(expectedResult);
  });
});
