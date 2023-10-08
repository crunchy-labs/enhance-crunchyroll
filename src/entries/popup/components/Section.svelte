<script lang="ts">
    export let title: string;
    export let open = true;
</script>

<details bind:open>
  <summary>{title}</summary>
  <div>
    <slot />
  </div>
</details>

<style lang="scss">
  details {
    summary {
      cursor: pointer;

      border-bottom: 1px solid #4a4e58;

      margin-bottom: 0.5rem;
    }

    & > div {
      margin-left: 0.5rem;
    }
  }
</style>
