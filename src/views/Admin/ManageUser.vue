<template>
  <div>
    <!-- Navigation bar -->
    <AdminNavbar></AdminNavbar>

    <!-- Sidebar -->
    <AdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

    <v-container>
      <v-card
        variant="outlined"
        elevation="4"
        width="100%"
        style="max-width: 1500px; margin-left: -100px"
      >
        <v-card-title style="background: green; color: white" class="text-center"
          ><v-icon>mdi-account-group</v-icon> Users
        </v-card-title>
        <v-alert style="margin-top: 20px" v-model="successAlert" type="success" dismissible>
          User added successfully!
        </v-alert>
        <v-card-text style="margin-top: 20px">
          <v-btn
            @click="openAddDialog"
            color=""
            style="background: green; color: white; text-transform: capitalize"
            >Add User</v-btn
          >
        </v-card-text>
        <v-data-table
          :headers="headers"
          :items="users"
          :search="search"
          style="text-transform: none"
        >
          <!-- Action buttons -->
          <template v-slot:item.action="{ item }">
            <v-btn elevation="0" style="text-transform: capitalize" @click="openEditDialog(item)"
              ><v-icon color="success">mdi-pencil</v-icon></v-btn
            >
            <v-btn
              elevation="0"
              style="text-transform: capitalize"
              class="mr-4"
              @click="openViewDialog(item)"
              ><v-icon>mdi-eye</v-icon></v-btn
            >
            <v-btn
              elevation="0"
              style="text-transform: capitalize"
              class="mr-4"
              @click="openDeleteDialog(item)"
              ><v-icon color="red">mdi-delete</v-icon></v-btn
            >
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <v-dialog v-model="addDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-center" style="background: green; color: white"
          >Add User</v-card-title
        >
        <v-card-text>
          <!-- Form to add user -->
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="newUser.username"
              label="Username"
              variant="outlined"
            ></v-text-field>
            <v-text-field v-model="newUser.email" label="Email" variant="outlined"></v-text-field>
            <v-text-field
              v-model="newUser.password"
              label="Password"
              type="password"
              variant="outlined"
            ></v-text-field>
            <!-- Profile picture upload -->

            <!-- Add more fields as needed -->

            <!-- Add any additional fields here -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="closeAddDialog"
            color="white"
            style="background: red; text-transform: capitalize; margin-left: 20px"
            >Cancel</v-btn
          >
          <v-btn
            @click="addUser"
            color="white"
            style="background: green; text-transform: capitalize"
            >Add</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <!-- Your edit dialog code -->

    <!-- View Dialog -->
    <!-- Your view dialog code -->

    <!-- Delete Dialog -->
    <!-- Your delete dialog code -->
  </div>
</template>

<script>
import AdminNavbar from '@/components/AdminNavbar.vue'
import AdminSidebar from '@/components/AdminSiderbar.vue'
import axios from 'axios'

export default {
  components: {
    AdminNavbar,
    AdminSidebar
  },
  data() {
    return {
      successAlert: false, // Alert state for success message
      addDialog: false, // Dialog state for adding user
      sidebar: true, // Initialize the sidebar as open
      newUser: {
        username: '',
        email: '',
        password: '',
        profilePicture: ''
        // Add more fields as needed
      },
      headers: [
        // Define table headers
        { title: 'Name', value: 'username' },
        { title: 'Email', value: 'email' },
        { title: 'Action', value: 'action' }
      ],
      users: [], // Array to store user data
      search: '', // Search query
      loading: false, // Loading state
      selectedItem: null, // Selected item for editing or viewing
      editDialog: false,
      viewDialog: false,
      deleteDialog: false
    }
  },
  methods: {
    openAddDialog() {
      // Method to open the add user dialog
      this.addDialog = true
    },

    closeAddDialog() {
      // Method to close the add user dialog
      this.addDialog = false
    },

    showSuccessAlert() {
      // Method to show the success alert
      this.successAlert = true

      // Hide the alert after 4 seconds
      setTimeout(() => {
        this.successAlert = false
      }, 4000)
    },

    async addUser() {
      // Method to add a new user
      try {
        // Perform any client-side validation here if needed

        // Send a POST request to add the user
        const response = await axios.post('http://127.0.0.1:8000/api/register/', this.newUser)

        // Optionally, handle success response

        this.showSuccessAlert()
        // Close the dialog after adding user
        this.closeAddDialog()

        // Refresh the user list
        this.loadUsers()
      } catch (error) {
        console.error('Error adding user:', error)
      }
    },

    toggleSidebar() {
      // Method to toggle the sidebar
      this.sidebar = !this.sidebar
    },
    async loadUsers() {
      try {
        this.loading = true
        const response = await axios.get(`http://127.0.0.1:8000/api/registered-users/`)
        console.log('Response:', response.data) // Log the response data

        // Check if response data is an array
        if (Array.isArray(response.data)) {
          // If it's an array, directly assign it to users
          this.users = response.data
        } else if (response.data && typeof response.data === 'object') {
          // If it's an object, assume it contains a users property which holds the array of users
          this.users = response.data.users || []
        } else {
          // If it's neither an array nor an object, log an error
          console.error('Invalid response format:', response.data)
        }

        this.loading = false
      } catch (error) {
        console.error('Error fetching users:', error)
        this.loading = false
      }
    }

    // Your other methods for edit, view, and delete dialogs
  },
  created() {
    // Fetch users when the component is created
    this.loadUsers()
  }
}
</script>

<style scoped>
/* Add custom styles here */
</style>
