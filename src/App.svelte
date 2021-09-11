<script>
	import DatoCmsPlugin from 'datocms-plugins-sdk';
	import 'datocms-plugins-sdk/dist/sdk.css';
	import { onMount } from 'svelte';

	let token;
	let datoPlugin;
	let searchString = '';
	let searchResult = [];
	let connectedListing;

	const onInputChanged = () => {
		fetchListings();
	}

	const fetchListings = () => {
		if (searchString.length <= 3 || token.length === 0) {
			searchResult = [];
			return;
		}
		fetch(`https://api.hostaway.com/v1/listings?limit=20&sortOrder=name&match=${searchString}`, { headers: { authorization: `Bearer ${token}` } })
			.then(response => response.json()
			.then(data => {
				searchResult = data.result;
			}));
	}

	const onRemoveConnectedListing = () => {
		connectedListing = null;
	}

	const onListingSelected = (listing) => {
		connectedListing = { hostawayId: listing.id, name: listing.name };
		datoPlugin.setFieldValue(datoPlugin.fieldPath, JSON.stringify(connectedListing));
		searchResult = [];
		searchString = '';
	}

	onMount(() => {
		DatoCmsPlugin.init()
		.then((plugin) => {
			plugin.startAutoResizer();
			datoPlugin = plugin;
			token = plugin.parameters.global.hostawayToken;
			connectedListing = JSON.parse(plugin.getFieldValue(plugin.fieldPath));
		});
	});
</script>

<div class="container">
	{#if !connectedListing}
		<input type="text" placeholder="Search listing" bind:value={searchString} on:input={onInputChanged}>
		<div class="search-results">
			{#each searchResult as listing}
				<span class="result-row" on:click={() => onListingSelected(listing)}>{listing.id} {listing.name}</span>
			{/each}
		</div>
	{:else}
		<div>
			<span class="listing">{connectedListing.hostawayId} {connectedListing.name}<span on:click={onRemoveConnectedListing} class="remove">Remove</span></span>
		</div>
	{/if}
</div>

<style>
	.container {
		background-color: white;
		position: relative;
	}

	.search-results {
		height: auto;
		border-bottom: 1px solid #f0f0f0;
		border-left: 1px solid #f0f0f0;
		border-right: 1px solid #f0f0f0;
	}

	.result-row {
		display: block;
		padding: 10px;
		cursor: pointer;
	}

	.result-row:hover {
		background-color: var(--semi-transparent-accent-color);
	}

	.listing {
		display: flex;
		align-items: center;
		border: 1px solid #f0f0f0;
		padding: 10px;
	}
	.remove {
		font-size: .8rem;
		color: #ff5e49;
		margin-left: 20px;
		cursor: pointer;
	}
</style>