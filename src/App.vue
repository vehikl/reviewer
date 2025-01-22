<script setup lang="ts">
import { ref } from 'vue'
import PeopleList from './components/PeopleList.vue'
import AddPersonForm from './components/AddPersonForm.vue'

interface Person {
    id: number
    name: string
}

const people = ref<Person[]>([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
    { id: 4, name: "Alice Williams" },
    { id: 5, name: "Charlie Brown" },
])

const addPerson = (name: string) => {
    const newId = Math.max(...people.value.map(p => p.id), 0) + 1
    people.value.unshift({ id: newId, name })
}

const deletePerson = (id: number) => {
    const index = people.value.findIndex(p => p.id === id)
    if (index !== -1) {
        people.value.splice(index, 1)
    }
}
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">People List</h1>
        <div class="bg-white rounded-lg shadow">
            <AddPersonForm @add-person="addPerson" />
            <PeopleList v-model:people="people" @delete-person="deletePerson" />
        </div>
    </div>
</template>