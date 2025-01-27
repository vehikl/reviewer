<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { github, type PullRequest } from '../services/github'

const pullRequests = ref<PullRequest[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
    try {
        pullRequests.value = await github.getPullRequests()
    } catch (e) {
        error.value = 'Failed to load pull requests'
        console.error(e)
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div class="bg-white rounded-lg shadow mb-4 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Open Pull Requests</h2>

        <div v-if="isLoading" class="text-gray-500">
            Loading pull requests...
        </div>

        <div v-else-if="error" class="text-red-500">
            {{ error }}
        </div>

        <div v-else-if="pullRequests.length === 0" class="text-gray-500">
            No open pull requests
        </div>

        <ul v-else class="divide-y divide-gray-200">
            <li v-for="pr in pullRequests" :key="pr.number" class="py-3">
                <a :href="pr.html_url" target="_blank"
                    class="flex items-center justify-between hover:bg-gray-50 p-2 rounded">
                    <div>
                        <span class="text-gray-900 font-medium">#{{ pr.number }}</span>
                        <span class="ml-2 text-gray-700">{{ pr.title }}</span>
                    </div>
                    <span class="text-gray-500 text-sm">by {{ pr.user.login }}</span>
                </a>
            </li>
        </ul>
    </div>
</template>