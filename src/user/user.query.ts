import { FindOptions } from 'sequelize';

export const QueryFindMembers = (where, order, pagination): FindOptions => ({
  where,
  order,
  limit: pagination != null ? pagination.size : null,
  offset: pagination != null ? pagination.page * pagination.size : null,
  include: [

  ]
});