<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Person {
    id: number
    name: string
}

const props = defineProps<{
    people: Person[]
    currentIndex: number
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
        <template #item="{ element: person, index }">
            <div class="p-4 border-b border-gray-200 hover:bg-gray-50 group select-none transition-colors"
                :class="{ 'bg-indigo-50': index === currentIndex }">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-3 flex-1">
                        <div class="text-gray-400 group-hover:text-gray-600 transition-colors">
                            <Bars3Icon class="h-5 w-5" />
                        </div>
                        <h3 class="text-lg font-medium"
                            :class="{ 'text-indigo-900': index === currentIndex, 'text-gray-900': index !== currentIndex }">
                            {{ person.name }}
                        </h3>
                    </div>
                    <button class="delete-btn text-gray-400 hover:text-red-500 focus:outline-none"
                        @click.stop="emit('delete-person', person.id)">
                        <XMarkIcon class="h-5 w-5" />
                    </button>
                </div>
            </div>
        </template>
    </draggable>
</template>