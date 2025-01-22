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
        class="divide-y divide-gray-200 max-h-96 overflow-y-auto" ghost-class="bg-gray-100" drag-class="opacity-75">
        <template #item="{ element: person }">
            <div class="p-4 border-b border-gray-200 hover:bg-gray-50 group select-none">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3 flex-1">
                        <div class="text-gray-400 group-hover:text-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M7 2a2 2 0 1 0 0 4h10a2 2 0 1 0 0-4H7zM7 8a2 2 0 1 0 0 4h10a2 2 0 1 0 0-4H7zM7 14a2 2 0 1 0 0 4h10a2 2 0 1 0 0-4H7z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900">{{ person.name }}</h3>
                    </div>
                    <button class="delete-btn text-gray-400 hover:text-red-500 focus:outline-none"
                        @click.stop="emit('delete-person', person.id)">
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