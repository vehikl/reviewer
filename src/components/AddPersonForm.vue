<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { github, type GitHubUser } from '../services/github'

const emit = defineEmits<{
    (e: 'add-person', person: GitHubUser): void
}>()

const newUsername = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
    const username = newUsername.value.trim()
    if (!username) return
    
    isLoading.value = true
    error.value = null

    try {
        const user = await github.getUser(username)
        if (user) {
            emit('add-person', user)
            newUsername.value = ''
        } else {
            error.value = 'GitHub user not found'
        }
    } catch (e) {
        error.value = 'Failed to check GitHub user'
        console.error(e)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="p-4 border-b border-gray-200">
        <form @submit.prevent="handleSubmit" class="space-y-2">
            <div class="flex gap-4">
                <input v-model="newUsername" type="text" placeholder="Enter GitHub username"
                    class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    :disabled="isLoading" required>
                <button type="submit" :disabled="isLoading"
                    class="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    <PlusIcon class="h-5 w-5" />
                    {{ isLoading ? 'Checking...' : 'Add Person' }}
                </button>
            </div>
            <div v-if="error" class="text-sm text-red-600">{{ error }}</div>
        </form>
    </div>
</template>