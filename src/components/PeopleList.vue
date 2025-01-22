<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'

interface Person {
    id: number
    name: string
}

const props = defineProps<{
    people: Person[]
}>()

const emit = defineEmits<{
    (e: 'delete-person', id: number): void
    (e: 'update:people', people: Person[]): void
}>()

const peopleList = computed({
    get: () => props.people,
    set: (value) => emit('update:people', value)
})
</script>

<template>
    <draggable v-model="peopleList" :animation="200" item-key="id"
        class="divide-y divide-gray-200 max-h-96 overflow-y-auto" handle=".drag-handle">
        <template #item="{ element: person }">
            <div class="p-4 border-b border-gray-200 hover:bg-gray-50">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3 flex-1">
                        <button class="drag-handle text-gray-400 cursor-move hover:text-gray-600 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                        <h3 class="text-lg font-medium text-gray-900">{{ person.name }}</h3>
                    </div>
                    <button class="delete-btn text-gray-400 hover:text-red-500 focus:outline-none"
                        @click="emit('delete-person', person.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </template>
    </draggable>
</template>