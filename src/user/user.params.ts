
import { QueryParamsDto } from '../../helper/query-params.helper';
import { Op } from 'sequelize';

export class QueryParamsUser extends QueryParamsDto {
  mode: QueryMode;
  id: string;
  filter: string;
  page: number;
  size: number;
  sort: string;
  select: string;
  download: boolean;
}

export interface FilterGroup {
  id: string,
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
}

export const ToSeqWhere = (q: QueryParamsUser) => {
  let filterQuery = {};

  if (q['id']) {
    filterQuery['id'] = q['id'];
  }

  if (q['age']) { 
    filterQuery['age'] = q['age'];
  }

   //filter using sparator ,
  if (q['onYear']) {
    const ageFilter = q['onYear'].split(','); 
    if (ageFilter.length === 1) {
      filterQuery['age'] = ageFilter[0]; 
    } else if (ageFilter.length === 2) {
      filterQuery['age'] = {
        [Op.between]: [ageFilter[0], ageFilter[1]],
      };
    }
  }

   //filter using sparator ,
   if (q['name']) {
    const name = q['name'].split(',').map(a => a.trim());
    if (name.length === 1) {
      filterQuery['name'] = {
        [Op.like]: `%${name[0]}%`
      };
    } else if (name.length > 1) {
      filterQuery['name'] = {
        [Op.or]: name.map(a => ({
          [Op.like]: `%${a}%`,
        }))
      };
    }
  }

  if (q['email']) {
    const email = q['email'].split(',').map(a => a.trim());
    if (email.length === 1) {
      filterQuery['email'] = {
        [Op.like]: `%${email[0]}%`
      };
    } else if (email.length > 1) {
      filterQuery['email'] = {
        [Op.or]: email.map(a => ({
          [Op.like]: `%${a}%`,
        }))
      };
    }
  }

  if (q['gender']) { 
    filterQuery['gender'] = { [Op.like]: `%${q['gender']}%` };
  }

  //To Do Encyption filter
  // if (q.filter) {
  //   const filter: FilterGroup = JSON.parse(q.filter);
  //   Object.keys(filter).forEach((k) => {
  //     switch (k) {
  //       case 'id':
  //         filterQuery = {
  //           ...filterQuery,
  //           id: filter.id,
  //         };
  //         break;
  //       case 'name':
  //         filterQuery = {
  //           ...filterQuery,
  //           name: { [Op.like]: `%${filter.name}%` },
  //         };
  //         break;
  //       case 'email':
  //         filterQuery = {
  //           ...filterQuery,
  //           email: filter.email,
  //         };
  //         break;
  //       case 'age':
  //         filterQuery = {
  //           ...filterQuery,
  //           age: filter.age,
  //         };
  //         break;
  //       case 'gender':
  //         filterQuery = {
  //           ...filterQuery,
  //           gender: filter.gender,
  //         };
  //         break;
  //     }
  //   });
  // }

  return filterQuery;
};




export const ToSeqAttributes = (q: QueryParamsDto) => {
  if (q.select) {
    const f = atob(q.select);
    const selectObject = JSON.parse(f);
    if (f == '') return [];

    const attributes =
      selectObject &&
      Object.keys(selectObject).map((k) => {
        if (selectObject[k]) return k;
      });
    return attributes;
  }

  return undefined;
};


export type QueryMode = 'combobox' | 'table' | 'list';
