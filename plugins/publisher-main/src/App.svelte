<script lang="ts">
  import Counter from "./lib/Counter.svelte"
  const message = "Hello, World!"
</script>

<main>
  <div>
    This is svelte {message}
    <Counter />

    <!--
    <div class="b3-dialog__content">
      <textarea class="b3-text-field fn__block" placeholder="readonly text in the menu" />
    </div>
    <div class="b3-dialog__action">
      <button class="b3-button b3-button--cancel">${this.i18n.cancel}</button>
      <div class="fn__space" />
      <button class="b3-button b3-button--text">${this.i18n.save}</button>
    </div>
  </div>
  -->
  </div>
</main>
