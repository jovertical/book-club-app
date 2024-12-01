import { Welcome } from '../welcome/welcome';
import type { Route } from './+types/_index';

export function meta({ data }: Route.MetaArgs) {
  console.log('data', data);

  return [
    { title: 'Book Club' },
    { name: 'description', content: 'Welcome to your favorite book club!' },
  ];
}

export default function Home() {
  return <Welcome />;
}
