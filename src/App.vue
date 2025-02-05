<script setup lang="ts">
import { ref, computed } from 'vue'
import PeopleList from './components/PeopleList.vue'
import AddPersonForm from './components/AddPersonForm.vue'
import TopPerson from './components/TopPerson.vue'
import PullRequests from './components/PullRequests.vue'
import { type Person, type GitHubUser, type PullRequest } from './types'

const people = ref<Person[]>([])
const currentIndex = ref(0)
const selectedPR = ref<PullRequest | null>(null)

const topPerson = computed(() =>
    currentIndex.value < people.value.length ? people.value[currentIndex.value] : undefined
)

const addPerson = (person: GitHubUser) => {
    const newId = Math.max(...people.value.map(p => p.id), 0) + 1
    people.value.unshift({ 
        id: newId, 
        name: person.name,
        username: person.login,
        avatar_url: person.avatar_url
    })
    // Reset current index when adding new person at the top
    currentIndex.value = 0
}

const deletePerson = (id: number) => {
    const index = people.value.findIndex(p => p.id === id)
    if (index !== -1) {
        people.value.splice(index, 1)
        // Adjust currentIndex if needed
        if (index <= currentIndex.value && currentIndex.value > 0) {
            currentIndex.value--
        }
    }
}

const handleAssign = () => {
    if (people.value.length > 0) {
        const [assigned] = people.value.splice(currentIndex.value, 1)
        people.value.push(assigned)
        // Always reset to first person after assignment
        currentIndex.value = 0
    }
}

const handleSkip = () => {
    if (people.value.length > 0) {
        currentIndex.value = (currentIndex.value + 1) % people.value.length
    }
}
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Pick a Reviewer
        </h1>

        <PullRequests v-model:selected="selectedPR" />
        <TopPerson 
            :person="topPerson" 
            :selected-pr="selectedPR"
            @assign="handleAssign" 
            @skip="handleSkip" 
        />

        <div class="bg-white rounded-lg shadow">
            <AddPersonForm @add-person="addPerson" />
            <PeopleList v-model:people="people" :current-index="currentIndex" @delete-person="deletePerson" />
        </div>
    </div>
</template>