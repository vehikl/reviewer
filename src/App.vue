<script setup lang="ts">
import { ref, computed } from 'vue'
import PeopleList from './components/PeopleList.vue'
import AddPersonForm from './components/AddPersonForm.vue'
import TopPerson from './components/TopPerson.vue'
import PullRequests from './components/PullRequests.vue'
import { type Person, type GitHubUser, type PullRequest } from './types'
import { github } from './services/github'

const people = ref<Person[]>([])
const currentIndex = ref(0)
const selectedPR = ref<PullRequest | null>(null)
const isAssigning = ref(false)

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

const handleAssign = async () => {
    if (!selectedPR.value || !topPerson.value || isAssigning.value) return

    try {
        isAssigning.value = true
        await github.assignReviewer(selectedPR.value.number, topPerson.value.username)
        
        // Move the assigned person to the end of the list
        const [assigned] = people.value.splice(currentIndex.value, 1)
        people.value.push(assigned)
        
        // Reset selections and index
        selectedPR.value = null
        currentIndex.value = 0
    } catch (error) {
        console.error('Failed to assign reviewer:', error)
        // You might want to show an error message to the user here
    } finally {
        isAssigning.value = false
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
            :is-assigning="isAssigning"
            @assign="handleAssign" 
            @skip="handleSkip" 
        />

        <div class="bg-white rounded-lg shadow">
            <AddPersonForm @add-person="addPerson" />
            <PeopleList v-model:people="people" :current-index="currentIndex" @delete-person="deletePerson" />
        </div>
    </div>
</template>