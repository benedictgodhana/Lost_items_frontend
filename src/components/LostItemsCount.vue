<template>
  <v-card
    style="margin: 8px; border-radius: 10px"
    variant="outlined"
    elevation="3"
    height="200"
    width="300"
  >
    <v-img src="/mystery-box_7486890.png" style="margin-top: 10px" height="50" contain></v-img>
    <v-card-title style="font-size: 14px">Number of Lost Items</v-card-title>
    <v-card-text>{{ itemsCount }}</v-card-text>
    <v-card-actions>
      <v-btn
        color="white"
        to="/admin/manage-users"
        style="background: green; width: 100%; text-transform: lowercase"
      >
        <v-icon>mdi-link</v-icon>View Lost Items
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axiosInstance from '../service/api' // Import the Axios instance

export default {
  data() {
    return {
      itemsCount: 0 // Initialize lost items count
    }
  },
  mounted() {
    this.fetchItemsCount() // Fetch lost items count when the component is mounted
  },
  methods: {
    fetchItemsCount() {
      axiosInstance
        .get('/api/total_lost_items/') // Assuming the endpoint is located at '/api/total_lost_items/'
        .then((response) => {
          this.itemsCount = response.data.total_items // Update lost items count with the response data
        })
        .catch((error) => {
          console.error('Error fetching lost items count:', error)
        })
    }
  }
}
</script>
