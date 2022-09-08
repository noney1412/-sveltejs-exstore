/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

interface ImportMetaEnv {
	readonly VITE_DISCORD_CLIENT_ID: string;
	readonly VITE_DISCORD_CLIENT_SECRET: string;
	readonly VITE_FB_REDIRECT_URL: string;
	readonly VITE_FB_CLIENT_ID: string;
	readonly VITE_FB_CLIENT_SECRET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace svelte.JSX {
	export declare type UtilityNames =
		| 'p'
		| 'm'
		| 'w'
		| 'h'
		| 'z'
		| 'border'
		| 'grid'
		| 'flex'
		| 'bg'
		| 'text'
		| 'font'
		| 'opacity'
		| 'animate'
		| 'transition'
		| 'transform'
		| 'align'
		| 'justify'
		| 'content'
		| 'pos'
		| 'box'
		| 'overflow'
		| 'underline'
		| 'list'
		| 'gradient'
		| 'divide'
		| 'gap'
		| 'ring'
		| 'icon'
		| 'container'
		| 'space'
		| 'table'
		| 'order'
		| 'place'
		| 'display'
		| 'shadow'
		| 'blend'
		| 'filter'
		| 'backdrop'
		| 'cursor'
		| 'outline'
		| 'select';
	export declare type VariantNames =
		| 'hover'
		| 'active'
		| 'focus'
		| 'enabled'
		| 'dark'
		| 'light'
		| 'sm'
		| 'lg'
		| 'md'
		| 'xl'
		| 'xxl'
		| 'first'
		| 'last'
		| 'child'
		| 'root'
		| 'before'
		| 'after'
		| 'all'
		| 'desktop'
		| 'wide';

	export declare type AttributifyNames<Prefix extends string = ''> =
		| `${Prefix}${UtilityNames}`
		| `${Prefix}${VariantNames}`
		| `${Prefix}${VariantNames}:${UtilityNames}`;

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface HTMLProps<T>
		extends Partial<Record<AttributifyNames | keyof HTMLProps<T>, string>> {}
}
