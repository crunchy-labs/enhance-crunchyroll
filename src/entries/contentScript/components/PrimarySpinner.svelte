<div />

<style lang="scss">
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	div {
		border: 4px solid #000;
		border-top-color: #f47521;
		border-radius: 50%;
		animation: spin 1s linear infinite;

		width: calc(100% - 8px);
		height: calc(100% - 8px);
	}
</style>
