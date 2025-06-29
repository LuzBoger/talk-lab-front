<script setup lang="ts">

import {ref,defineEmits} from 'vue';

const emits = defineEmits<{
    (event: "update:code", value:string): void
}>()

const inputValue = ref<string>("");

const onInput = () :void => {
    inputValue.value = inputValue.value.replace(/\D/g, "").slice(0,6);
    emits('update:code', inputValue.value)
}
</script>

<template>
    <input
        type="text"
        v-model="inputValue"
        maxlength="6"
        placeholder="Entrez le code à 6 chiffre"
        class="border px-2 py-1 rounded w-full text-white"
        @input="onInput"
    />
</template>