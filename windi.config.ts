import { defineConfig } from 'windicss/helpers';
import { FullConfig } from 'windicss/types/interfaces';

const config: FullConfig = {
	darkMode: 'class',
	prefixer: false,
	attributify: true,
	theme: {
		screens: {
			desktop: '1024px',
			wide: '1900px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		extend: {
			width: {
				'page-content-w': '1440px'
			},
			colors: {
				neutral: {
					'0': '#ffffff',
					'10': '#fafafa',
					'20': '#f6f6f6',
					'30': '#ededed',
					'40': '#e1e1e1',
					'50': '#c6c6c6',
					'60': '#b8b8b8',
					'70': '#adadad',
					'80': '#9f9f9f',
					'90': '#919191',
					'100': '#838383',
					'200': '#767676',
					'300': '#686868',
					'400': '#5c5c5c',
					'500': '#4f4f4f',
					'600': '#434343',
					'700': '#333333',
					'800': '#252525',
					'900': '#1a1a1a'
				},
				secondary: {
					'50': '#e6fbf9',
					'75': '#98f0e7',
					'100': '#6deadd',
					'200': '#2ee0cf',
					'300': '#03dac5',
					'400': '#02998a',
					'500': '#028578'
				},
				primary: {
					'50': '#fff4e8',
					'75': '#fed1a0',
					'100': '#febd78',
					'200': '#fda13e',
					'300': '#fd8e17',
					'400': '#b16310',
					'500': '#9a570e'
				},
				surface: {
					'50': '#f0f1f2',
					'75': '#c2c5cb',
					'100': '#a9adb5',
					'200': '#848a96',
					'300': '#6b7280',
					'400': '#4b505a',
					'500': '#41464e'
				}
			},
			flex: {
				'1/2': '0 0 50%'
			}
		}
	}
};

export default defineConfig(config);
