import axios from 'axios';

const api = axios.create(
{
  baseURL: 'http://localhost:3000'
});
//recuperer les tickets
export function getTickets()
{
  return api.get('/tickets');
}