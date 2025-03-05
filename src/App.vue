<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PeopleList from './components/PeopleList.vue'
import AddPersonForm from './components/AddPersonForm.vue'
import TopPerson from './components/TopPerson.vue'
import PullRequests from './components/PullRequests.vue'
import { type Person, type GitHubUser, type PullRequest } from './types'
import { github } from './services/github'
import { database } from './services/database'

const people = ref<Person[]>([])
const currentIndex = ref(0)
const selectedPR = ref<PullRequest | null>(null)
const isAssigning = ref(false)
const isLoading = ref(true)

// Load people from database on mount
onMounted(async () => {
    try {
        isLoading.value = true
        people.value = await database.getPeople()
    } catch (error) {
        console.error('Failed to load people from database:', error)
    } finally {
        isLoading.value = false
    }
})

const topPerson = computed(() =>
    currentIndex.value < people.value.length ? people.value[currentIndex.value] : undefined
)

const addPerson = async (person: GitHubUser) => {
    try {
        // Add person to database
        const newPerson = await database.addPerson({
            name: person.name,
            username: person.login,
            avatar_url: person.avatar_url
        })

        // Update local state
        people.value.unshift(newPerson)

        // Reset current index when adding new person at the top
        currentIndex.value = 0
    } catch (error) {
        console.error('Failed to add person to database:', error)
    }
}

const deletePerson = async (id: number) => {
    try {
        // Delete from database
        await database.deletePerson(id)

        // Update local state
        const index = people.value.findIndex((p: Person) => p.id === id)
        if (index !== -1) {
            people.value.splice(index, 1)
            // Adjust currentIndex if needed
            if (index <= currentIndex.value && currentIndex.value > 0) {
                currentIndex.value--
            }
        }
    } catch (error) {
        console.error('Failed to delete person from database:', error)
    }
}

const handleAssign = async () => {
    if (!selectedPR.value || !topPerson.value || isAssigning.value) return

    try {
        isAssigning.value = true
        await github.assignReviewer(selectedPR.value.number, topPerson.value.username)

        // Move the assigned person to the end of the list in the database
        await database.movePersonToEnd(topPerson.value.id)

        // Update local state
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

        <div v-if="isLoading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>

        <template v-else>
            <PullRequests v-model:selected="selectedPR" />
            <TopPerson :person="topPerson" :selected-pr="selectedPR" :is-assigning="isAssigning" @assign="handleAssign"
                @skip="handleSkip" />

            <div class="bg-white rounded-lg shadow">
                <AddPersonForm @add-person="addPerson" />
                <PeopleList v-model:people="people" :current-index="currentIndex" @delete-person="deletePerson" />
            </div>
        </template>
    </div>
</template>