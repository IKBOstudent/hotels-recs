import { createRoot } from 'react-dom/client';
import App from './App';

import './firebaseConfig';

import '@gravity-ui/uikit/styles/styles.scss';

import './styles/index.scss';
import './styles/theme.scss';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
