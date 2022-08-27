<div
	class="page"
	w="screen min-screen"
	h="screen min-screen"
	flex="~ nowrap"
	justify="center"
	m="auto"
>
	<main
		class="page-content"
		w="full desktop:page-content-w"
		h="full"
		p="t-20 b-60"
		flex="~ desktop:(flex row nowrap)"
	>
		<div w="full" h="full" flex="~ col desktop:1/2" justify="between" p="x-2">
			<header
				class="page-header"
				w="full"
				flex="~ col"
				justify="center desktop:center"
				align="items-center desktop:items-start"
				gap="y-3"
				font="tracking-wide"
			>
				<h1 select="all" m="desktop:y-4" hover="text-primary-200">EXTEND TOWN</h1>
				<h2 select="all" text="desktop:3xl" hover="text-primary-200">Roleplay & Community</h2>
			</header>
			<nav
				class="page-link-group"
				flex="~ col desktop:(row)"
				gap="3 desktop:(1)"
				font="tracking-widest light"
				select="none"
				m="desktop:b-18"
			>
				<a href="/whitelist/request" class="btn" w="full desktop:$btn-w" h="$btn-h" text="lg"
					>ขอไวริส</a
				>
				<a
					href="/home"
					class="btn-size-only"
					bg="neutral-900"
					hover="text-surface-75 text-lg"
					w="full desktop:240px">เข้าสู่หน้าหลัก</a
				>
			</nav>
		</div>
		<div class="hidden desktop:(block)">
			<img
				class="desktop:(block object-cover h-740px) img--mascot"
				src="/images/hero-mascot.webp"
				alt="extend-mascot"
				border="~ neutral-600/50"
			/>
		</div>
	</main>
</div>

<style lang="scss">
	.img--mascot {
		filter: grayscale(25%);
		box-shadow: inset -1px -1px 0.2px 0.2px theme('colors.neutral.900'),
			inset 0.2px 0.2px 1.2px 0.01px theme('colors.neutral.900'),
			theme('colors.neutral.900') 1px 5px 50px;
	}

	.img--mascot:hover {
		filter: drop-shadow(16px 16px 20px rgba(56, 39, 38, 0.559)) brightness(105%);
	}
</style>
