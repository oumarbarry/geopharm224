<script setup lang="ts">
const props = defineProps({ error: Object })

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        Erreur {{ props.error?.statusCode }}
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Il n'y a rien ici...
      </div>

      <q-btn
        no-caps
        unelevated
        color="white"
        text-color="blue"
        class="q-mt-xl"
        label="Revenez à la page principale"
        @click="handleError"
      />
    </div>
  </div>
</template>
