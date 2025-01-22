<script setup lang="ts">
import { CheckCircleIcon, ForwardIcon } from '@heroicons/vue/24/outline'

interface Person {
    id: number
    name: string
}

const props = defineProps<{
    person?: Person
}>()

const emit = defineEmits<{
    (e: 'assign'): void
    (e: 'skip'): void
}>()
</script>

<template>
    <div v-if="person" class="bg-white rounded-lg shadow mb-4 p-6">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">{{ person.name }}</h2>
        <div class="flex justify-center gap-4">
            <button @click="emit('assign')"
                class="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <CheckCircleIcon class="h-5 w-5" />
                Assign
            </button>
            <button @click="emit('skip')"
                class="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <ForwardIcon class="h-5 w-5" />
                Skip
            </button>
        </div>
    </div>
</template>