import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<DataProvider>
			<ToastProvider>
				<App />
			</ToastProvider>
		</DataProvider>
	</StrictMode>,
)
