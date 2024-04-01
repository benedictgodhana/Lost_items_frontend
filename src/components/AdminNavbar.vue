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
import axios from 'axios' // Import Axios instance

export default {
  data() {
    return {
      csrfToken: '' // Initialize CSRF token
    }
  },
  methods: {
    navigateToProfile() {
      // Define navigation logic to the profile page
    },
    navigateToNotifications() {
      // Define navigation logic to the notifications page
    },

    async fetchCSRFToken() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/csrf/')
        this.csrfToken = response.data.csrfToken
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
      }
    },

    async logout() {
      try {
        // Fetch CSRF token before logging out
        await this.fetchCSRFToken()

        // Make a POST request to the logout endpoint
        await axios.post('http://127.0.0.1:8000/api/logout/', null, {
          headers: {
            'X-CSRFToken': this.csrfToken // Include CSRF token in the request headers
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
    },
    getCookie(name) {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
    }
  },
  created() {
    // Fetch CSRF token when the component is created
    this.fetchCSRFToken()
  }
}
</script>
