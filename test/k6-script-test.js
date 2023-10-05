import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // Jumlah pengguna virtual (Virtual Users) yang akan mengakses API
  duration: '30s', // Durasi pengujian
};

export default function () {
  // Pengujian /users (GET) tanpa query
  let res = http.get('http://localhost:3000/users'); // Ganti URL sesuai dengan endpoint Anda
  check(res, {
    'status is 200': (r) => r.status === 200,
    // Tambahkan pengujian lain sesuai kebutuhan
  });
  sleep(1);

  // Pengujian /books (GET) tanpa query
  res = http.get('http://localhost:3000/books'); // Ganti URL sesuai dengan endpoint Anda
  check(res, {
    'status is 200': (r) => r.status === 200,
    // Tambahkan pengujian lain sesuai kebutuhan
  });
  sleep(1);

  // Pengujian /users (GET) dengan query params
  const query = {
    onYear: '20,23',
    name: 'Ricky',
    email: 'Ricky,Aeth',
    filter: 'eyJhZ2UiOiAyM30=',
  };
  const queryStringFormatted = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&');
  res = http.get(`http://localhost:3000/users?${queryStringFormatted}`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    // Tambahkan pengujian lain sesuai kebutuhan
  });
  sleep(1);

  // Pengujian /books (GET) dengan query params
  const bookQuery = {
    onYear: '2019,2023',
    title: 'Myth of,Ragnarok',
    author: 'Ricky,Aeth',
  };
  const bookQueryStringFormatted = Object.keys(bookQuery)
    .map((key) => `${key}=${bookQuery[key]}`)
    .join('&');
  res = http.get(`http://localhost:3000/books?${bookQueryStringFormatted}`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    // Tambahkan pengujian lain sesuai kebutuhan
  });
  sleep(1);
}
