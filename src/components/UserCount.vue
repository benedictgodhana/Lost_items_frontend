<template>
  <v-card
    style="margin: 8px; border-radius: 10px"
    variant="outlined"
    elevation="3"
    height="200"
    width="300"
  >
    <v-img
      src="/person-circle-exclamation_11271901.png"
      style="margin-top: 10px"
      height="50"
      contain
    ></v-img>
    <v-card-title style="font-size: 14px">Number of Registered Users</v-card-title>
    <v-card-text>{{ userCount }}</v-card-text>
    <v-card-actions>
      <v-btn
        color="white"
        to="/admin/manage-users"
        style="background: green; width: 100%; text-transform: lowercase"
        ><v-icon>mdi-link</v-icon>View Victims</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
import axiosInstance from '../service/api' // Import the Axios instance

export default {
  data() {
    return {
      userCount: 0 // Initialize user count
    }
  },
  mounted() {
    this.fetchUserCount() // Fetch user count when the component is mounted
  },
  methods: {
    fetchUserCount() {
      axiosInstance
        .get('/user_count/') // Make sure the endpoint matches your Django URL pattern
        .then((response) => {
          this.userCount = response.data.user_count // Update user count with the response data
        })
        .catch((error) => {
          console.error('Error fetching user count:', error)
        })
    }
  }
}
</script>
