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
        width="120%"
        style="max-width: 1500px; margin-left: -100px"
      >
        <v-card-title style="background: green; color: white" class="text-center"
          ><v-icon>mdi-laptop</v-icon> Claimed Items Request
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="lostItems"
          :search="search"
          style="text-transform: capitalize"
        >
          <!-- Custom slot for displaying image -->
          <template v-slot:item.image="{ item }">
            <v-img :src="item.image" max-height="64" style="border-radius: 10px"></v-img>
          </template>
          <template v-slot:item.action="{ item }">
            <!-- Action buttons -->
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
    <!-- v-data-table for lost items -->

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title class="text-center" style="background: green; color: white"
          >Edit Item</v-card-title
        >
        <!-- Add your form fields for editing here -->
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeEditDialog">Close</v-btn>
          <v-btn color="blue darken-1" text @click="saveEditedItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="600">
      <v-card>
        <v-card-title class="text-center" style="background: green; color: white"
          >View Item</v-card-title
        >
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Claimant Name</v-list-item-title>
                <v-list-item-subtitle>{{ selectedItem.claimant_name }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Claimant Contact</v-list-item-title>
                <v-list-item-subtitle>{{ selectedItem.claimant_contact }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Description</v-list-item-title>
                <v-list-item-subtitle>{{ selectedItem.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Item</v-list-item-title>
                <v-list-item-subtitle>{{ selectedItem.lost_item }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Claiming Date</v-list-item-title>
                <v-list-item-subtitle>{{ selectedItem.claim_date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- Add more item details as needed -->
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="white"
            style="width: 100%; background: green; text-transform: capitalize"
            text
            @click="closeViewDialog"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="600">
      <v-card>
        <v-card-title class="text-center" style="background: green; color: white"
          >Delete Item</v-card-title
        >
        <!-- Display confirmation message here -->
        <v-card-actions>
          <v-btn color="red darken-1" text @click="closeDeleteDialog">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="confirmDeleteItem">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      sidebar: true, // Initialize the sidebar as open
      headers: [
        // Define table headers
        { title: 'Claimant Name', value: 'claimant_name' },
        { title: 'Claimant Contact', value: 'claimant_contact' },
        { title: 'Description', value: 'description' },
        { title: 'Claim Date', value: 'claim_date' },
        { title: 'Item', value: 'lost_item' }, // Add image header
        { title: 'Action', value: 'action' } // Add image header

        // Add more headers as needed
      ],
      lostItems: [], // Array to store lost items data
      search: '', // Search query
      loading: false, // Loading state
      selectedItem: null, // Selected item for editing or viewing
      editDialog: false,
      viewDialog: false,
      deleteDialog: false
    }
  },
  methods: {
    toggleSidebar() {
      // Method to toggle the sidebar
      this.sidebar = !this.sidebar
    },
    async loadLostItems() {
      // Fetch lost items from the API
      try {
        this.loading = true
        const response = await axios.get(`http://127.0.0.1:8000/api/claims/`)
        console.log('Response:', response.data) // Log the response data
        this.lostItems = response.data // Assuming response.data is an array
        this.loading = false
      } catch (error) {
        console.error('Error fetching lost items:', error)
        this.loading = false
      }
    },
    openEditDialog(item) {
      // Open edit dialog for the selected item
      this.selectedItem = item
      this.editDialog = true
      // Add code to populate form fields with item data if needed
    },
    openViewDialog(item) {
      // Open view dialog for the selected item
      this.selectedItem = item
      this.viewDialog = true
      // Add code to populate view dialog with item details
    },
    openDeleteDialog(item) {
      // Open delete dialog for the selected item
      this.selectedItem = item
      this.deleteDialog = true
      // Add code to confirm delete action
    },
    closeEditDialog() {
      // Close edit dialog
      this.editDialog = false
    },
    closeViewDialog() {
      // Close view dialog
      this.viewDialog = false
    },
    closeDeleteDialog() {
      // Close delete dialog
      this.deleteDialog = false
    },
    saveEditedItem() {
      // Save edited item
      // Add code to send edited item data to backend
      this.editDialog = false
    },
    confirmDeleteItem() {
      // Confirm and delete item
      // Add code to send delete request to backend
      this.deleteDialog = false
    }
  },
  created() {
    // Fetch lost items when the component is created
    this.loadLostItems()
  }
}
</script>

<style scoped>
/* Add custom styles here */
</style>
