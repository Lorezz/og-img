import styles from '~/styles/style.css';
import App from '~/components/App';
export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export default function Index() {
  return <App />;
}
