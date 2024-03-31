<template>
  <v-app-bar app height="90" style="background: green; color: white">
    <!-- Logo -->
    <v-header>
      <img src="" alt="" height="90" style="margin-top: 10px; margin-left: 20px" />
    </v-header>

    <!-- Profile and logout buttons -->
    <v-btn
      style="margin-left: auto; font-weight: 500; font-family: 'poppins'; text-transform: lowercase"
      text
      @click="navigateToProfile"
    >
      <v-icon size="16" color="success">mdi-account-circle</v-icon> Profile
    </v-btn>
    <v-btn
      style="margin-left: 10px; font-weight: 500; font-family: 'poppins'; text-transform: lowercase"
      text
      @click="navigateToNotifications"
    >
      <v-icon size="16" color="orange">mdi-bell</v-icon> Notifications
    </v-btn>

    <v-btn
      style="margin-left: 10px; font-weight: 500; font-family: 'poppins'; text-transform: lowercase"
      text
      @click="logout"
    >
      <v-icon size="16" color="primary">mdi-logout</v-icon> Logout
    </v-btn>
  </v-app-bar>
</template>

<script>
import axiosInstance from '@/service/api' // Import Axios instance

export default {
  methods: {
    navigateToProfile() {
      // Define navigation logic to the profile page
    },
    async logout() {
      try {
        // Get the authentication token from localStorage
        const authToken = localStorage.getItem('token')

        // Make a POST request to the logout endpoint
        await axiosInstance.post('/logout', null, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })

        // Clear authentication tokens or user session
        localStorage.removeItem('token')
        localStorage.removeItem('userData') // Clear any other user-related data

        // Redirect the user to the login page
        this.$router.push('/') // Assuming '/login' is the login page route
      } catch (error) {
        console.error('Error logging out:', error)
      }
    }
  }
}
</script>
