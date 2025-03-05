import { type Person } from '../types'

// Define a class for handling IndexedDB operations
class IndexedDBService {
  private dbName = 'reviewerApp'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  // Initialize the database
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = (event: Event) => {
        console.error('Error opening database:', event)
        reject(new Error('Could not open database'))
      }

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve()
      }

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create the people store with auto-incrementing id
        if (!db.objectStoreNames.contains('people')) {
          const store = db.createObjectStore('people', { keyPath: 'id', autoIncrement: true })
          store.createIndex('username', 'username', { unique: true })
        }
      }
    })
  }

  // Get all people from the database
  async getPeople(): Promise<Person[]> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction('people', 'readonly')
      const store = transaction.objectStore('people')
      const request = store.getAll()

      request.onsuccess = () => {
        // Sort by id in descending order (newest first)
        const people = request.result.sort((a: Person, b: Person) => b.id - a.id)
        resolve(people)
      }

      request.onerror = (event: Event) => {
        console.error('Error getting people:', event)
        reject(new Error('Could not get people'))
      }
    })
  }

  // Add a person to the database
  async addPerson(person: Omit<Person, 'id'>): Promise<Person> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }
      
      const transaction = this.db.transaction('people', 'readwrite')
      const store = transaction.objectStore('people')
      
      // Add without an id - it will be auto-generated
      const request = store.add(person)
      
      transaction.oncomplete = () => {
        // We need to get the newly created person with its ID
        // Use the key from the add request to get the complete person object
        const getTransaction = this.db!.transaction('people', 'readonly')
        const getStore = getTransaction.objectStore('people')
        const getRequest = getStore.get(request.result)
        
        getRequest.onsuccess = () => {
          resolve(getRequest.result)
        }
        
        getRequest.onerror = (event: Event) => {
          console.error('Error getting added person:', event)
          reject(new Error('Person was added but could not be retrieved'))
        }
      }
      
      request.onerror = (event: Event) => {
        console.error('Error adding person:', event)
        reject(new Error('Could not add person'))
      }
    })
  }

  // Delete a person from the database
  async deletePerson(id: number): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }
      
      const transaction = this.db.transaction('people', 'readwrite')
      const store = transaction.objectStore('people')
      const request = store.delete(id)
      
      transaction.oncomplete = () => {
        resolve()
      }
      
      request.onerror = (event: Event) => {
        console.error('Error deleting person:', event)
        reject(new Error('Could not delete person'))
      }
    })
  }

  // Move a person to the end of the list (when assigned to a PR)
  async movePersonToEnd(id: number): Promise<void> {
    if (!this.db) await this.init()
    
    // Get the person
    const people = await this.getPeople()
    const personIndex = people.findIndex(p => p.id === id)
    
    if (personIndex === -1) return
    
    const person = people[personIndex]
    
    // First, delete the person
    await this.deletePerson(id)
    
    // Then add a new entry with the same data (but new ID at the end)
    await this.addPerson({
      name: person.name,
      username: person.username,
      avatar_url: person.avatar_url
    })
  }
}

// Create and export a singleton instance
const indexedDBService = new IndexedDBService()

// Export a database interface compatible with our app
export const database = {
  async getPeople(): Promise<Person[]> {
    return indexedDBService.getPeople()
  },
  
  async addPerson(person: Omit<Person, 'id'>): Promise<Person> {
    return indexedDBService.addPerson(person)
  },
  
  async deletePerson(id: number): Promise<void> {
    return indexedDBService.deletePerson(id)
  },
  
  async movePersonToEnd(id: number): Promise<void> {
    return indexedDBService.movePersonToEnd(id)
  }
} 