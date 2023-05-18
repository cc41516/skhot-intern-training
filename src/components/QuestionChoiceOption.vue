<template>
  <q-btn
    rounded
    unelevated
    no-wrap
    align="between"
    :ripple="false"
    size="xl"
    @click="selectOption"
    class="transparent-border"
    :class="{ 'selected-button': isSelected }"
  >
    <div class="text-body1 text-weight-regular">
      <q-avatar color="secondary" font-size="1.2rem" class="q-mr-xl">{{
        symbol
      }}</q-avatar>
      {{ content }}
    </div>
    <div v-if="isSelected">
      <q-icon
        name="check_circle_outline"
        color="secondary"
        size="md"
        class="q-ml-xl"
        :class="{ 'selected-icon': isSelected }"
      />
    </div>
  </q-btn>
</template>


<script setup lang="ts">
import { computed } from "vue";

interface Props {
  content: string;
  index: number;
  reply: number;
}

const props = defineProps<Props>();
const symbol = String.fromCharCode("A".charCodeAt(0) + props.index);
const isSelected = computed(() => props.index == props.reply);

const emit = defineEmits<{
  (e: "select", val: number): void;
}>();

function selectOption() {
  emit("select", props.index);
}
</script>


<style scoped lang="scss">
.transparent-border {
  border: 2px solid transparent;
}
.selected-button {
  border-color: $secondary;
  transition: all 0.8s ease;
}
.selected-icon {
  animation: fadeIn 0.8s;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
