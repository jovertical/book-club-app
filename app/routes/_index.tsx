import { Welcome } from '../welcome/welcome';

export function meta() {
  return [
    { title: 'Book Club' },
    { name: 'description', content: 'Welcome to your favorite book club!' },
  ];
}

export default function Home() {
  return <Welcome />;
}
