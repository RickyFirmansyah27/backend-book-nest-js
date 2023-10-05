import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1, // Jumlah pengguna virtual (Virtual Users) yang akan mengakses API
  duration: '30s', // Durasi pengujian
};

export default function () {
  // Pengujian /users (GET) tanpa query
  let resUser = http.get('http://host.docker.internal:8000/users'); // Ganti URL sesuai dengan endpoint Anda
  check(resUser, {
    'status is 200': (r) => r.status === 200,
    // Tambahkan pengujian lain sesuai kebutuhan
  });
  sleep(1);

  // Pengujian /books (GET) tanpa query
  let resBook = http.get('http://host.docker.internal:8000/books'); // Ganti URL sesuai dengan endpoint Anda
  check(resBook, {
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
  let resQueryUser = http.get(`http://host.docker.internal:8000/users?${queryStringFormatted}`);
  check(resQueryUser, {
    'status is 200': (r) => r.status === 200,
    // Tambahkan pengujian lain sesuai kebutuhan
  });
  sleep(1);

  // Pengujian /books (GET) dengan query params
  const bookQuery = {
    onYear: '2022,2023',
    tittle: 'Inferno,Edge',
    author: 'Ricky,Aeth',
  };
  const bookQueryStringFormatted = Object.keys(bookQuery)
    .map((key) => `${key}=${bookQuery[key]}`)
    .join('&');
  let resQueryBook = http.get(`http://host.docker.internal:8000/books?${bookQueryStringFormatted}`);
  check(resQueryBook, {
    'status is 200': (r) => r.status === 200,
    // Tambahkan pengujian lain sesuai kebutuhan
  });
  sleep(1);
}
