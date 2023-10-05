import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Simulate 50 users for 30 seconds
    { duration: '1m', target: 100 }, // Simulate 100 users for 1 minute
    { duration: '30s', target: 0 }, // Ramp down to 0 users
  ],
};

export default function () {
  const res = http.get('http://localhost:3000/users'); 
  check(res, { 'status was 200': (r) => r.status == 200 });
}
