<script lang="ts">
	import { searchCostCenters, searchProducts, type CostCenter, type Product } from '$lib/api';

	type SearchMode = 'product' | 'cost-center';

	let mode: SearchMode = 'product';
	let query = '';
	let loading = false;
	let error = '';

	let productResults: Product[] = [];
	let costCenterResults: CostCenter[] = [];

	// نتیجه فعال بر اساس mode
	$: activeResults = mode === 'product' ? productResults : costCenterResults;

	async function search() {
		if (!query.trim()) return;

		loading = true;
		error = '';

		try {
			if (mode === 'product') {
				const res = await searchProducts(query);
				productResults = res.items;
			} else {
				const res = await searchCostCenters(query);
				costCenterResults = res.items;
			}
		} catch {
			error = 'خطا در ارتباط با سرور';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-2xl font-bold">جستجو</h1>

	<!-- انتخاب نوع جستجو -->
	<div class="mb-6 flex gap-4">
		<button
			class={`rounded px-4 py-2 ${
				mode === 'product' ? 'bg-blue-600 text-white' : 'border border-gray-400'
			}`}
			on:click={() => (mode = 'product')}
		>
			جستجوی کالا
		</button>

		<button
			class={`rounded px-4 py-2 ${
				mode === 'cost-center' ? 'bg-blue-600 text-white' : 'border border-gray-400'
			}`}
			on:click={() => (mode = 'cost-center')}
		>
			مرکز هزینه
		</button>
	</div>

	<!-- ورودی -->
	<div class="mb-4 flex gap-2">
		<input
			type="text"
			placeholder="عبارت جستجو..."
			bind:value={query}
			on:keydown={(e) => e.key === 'Enter' && search()}
			class="flex-1 rounded border p-2 shadow-sm focus:ring-2 focus:outline-none"
		/>

		<button on:click={search} class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
			جستجو
		</button>
	</div>

	{#if loading}
		<p class="mb-4 text-gray-500">در حال جستجو...</p>
	{/if}

	{#if error}
		<p class="mb-4 text-red-600">{error}</p>
	{/if}

	<!-- جدول نتایج -->
	{#if activeResults.length > 0}
		<div class="overflow-x-auto">
			<table class="min-w-full border bg-white shadow-sm">
				<thead class="bg-gray-200">
					<tr>
						{#if mode === 'product'}
							<th class="border px-4 py-2 text-center">کد کالا</th>
							<th class="border px-4 py-2 text-center">نام کالا</th>
							<th class="border px-4 py-2 text-center">محل کالا</th>
						{:else}
							<th class="border px-4 py-2 text-center">کد مرکز</th>
							<th class="border px-4 py-2 text-center">نام مرکز</th>
						{/if}
					</tr>
				</thead>

				<tbody>
					{#each activeResults as item, i}
						<tr class={i % 2 === 0 ? 'bg-gray-50' : 'bg-red-50'}>
							{#if mode === 'product'}
								<!-- TS می‌فهمد اینجا Product است -->
								<td class="border px-4 py-2 text-center">
									{(item as Product)['کد کالا']}
								</td>
								<td class="border px-4 py-2 text-center">
									{(item as Product)['نام کالا']}
								</td>
								<td class="border px-4 py-2 text-center">
									{(item as Product)['محل کالا']}
								</td>
							{:else}
								<!-- TS می‌فهمد اینجا CostCenter است -->
								<td class="border px-4 py-2 text-center">
									{(item as CostCenter)['کد مرکز هزینه']}
								</td>
								<td class="border px-4 py-2 text-center">
									{(item as CostCenter)['نام مرکز']}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if !loading && !error}
		<p class="mt-4 text-gray-400">هیچ نتیجه‌ای یافت نشد.</p>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	:global(html) {
		background-color: theme(--color-gray-300);
	}
</style>
