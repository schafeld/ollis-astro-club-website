<script setup lang="ts">
import FortuneWheel from '~~/app/components/FortuneWheel.vue';

useHead({ title: 'Zufallszahlen' });
</script>

<template>
  <FortuneWheel
    title="Zufallszahlen"
    spin-label="Drehen!"
    :show-input="false"
    :full-page="true"
    :show-top-logo="true"
    home-href="/de"
  />
</template>