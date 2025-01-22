<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
    (e: 'add-person', name: string): void
}>()

const newPersonName = ref('')

const handleSubmit = () => {
    const name = newPersonName.value.trim()
    if (name) {
        emit('add-person', name)
        newPersonName.value = ''
    }
}
</script>

<template>
    <div class="p-4 border-b border-gray-200">
        <form @submit.prevent="handleSubmit" class="flex gap-4">
            <input v-model="newPersonName" type="text" placeholder="Enter name"
                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required>
            <button type="submit"
                class="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusIcon class="h-5 w-5" />
                Add Person
            </button>
        </form>
    </div>
</template>