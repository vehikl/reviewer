<script setup lang="ts">
import { CheckCircleIcon, ForwardIcon } from '@heroicons/vue/24/outline'
import { type Person, type PullRequest } from '../types'

const props = defineProps<{
    person?: Person
    selectedPr: PullRequest | null
    isAssigning?: boolean
}>()

const emit = defineEmits<{
    (e: 'assign'): void
    (e: 'skip'): void
}>()
</script>

<template>
    <div v-if="person" class="bg-white rounded-lg shadow mb-4 p-6">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">
            {{ person.name || person.username }}
        </h2>
        <div class="flex justify-center gap-4">
            <button @click="emit('assign')" 
                :disabled="!selectedPr || isAssigning"
                class="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <CheckCircleIcon class="h-5 w-5" :class="{ 'animate-spin': isAssigning }" />
                {{ isAssigning ? 'Assigning...' : (selectedPr ? `Assign to #${selectedPr.number}` : 'Select a PR first') }}
            </button>
            <button @click="emit('skip')"
                :disabled="isAssigning"
                class="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <ForwardIcon class="h-5 w-5" />
                Skip
            </button>
        </div>
    </div>
</template>