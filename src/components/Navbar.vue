<template>
  <v-app-bar
    app
    height="90"
    style="background: green; color: white; display: flex; align-items: center"
    elevation="0"
  >
    <v-header> </v-header>
    <!-- Logo with separator -->
    <v-btn style="font-weight: 500" icon @click="sidebar = !sidebar" class="hidden-md-and-up">
      <v-icon size="16">mdi-menu</v-icon>
    </v-btn>
    <v-spacer></v-spacer>

    <!-- Navigation buttons for larger screens -->

    <v-btn
      style="
        margin-left: -600px;
        font-weight: 500;
        font-family: 'poppins';
        text-transform: lowercase;
      "
      text
      to="/"
      class="hidden-sm-and-down"
    >
      <v-icon size="16">mdi-home</v-icon>Home
    </v-btn>

    <v-btn
      style="font-weight: 500; font-family: 'poppins'; text-transform: lowercase"
      @click="showSignUpModal"
      class="hidden-sm-and-down"
    >
      <v-icon size="16">mdi-comment-quote</v-icon>Report Lost Item
    </v-btn>
    <!-- Button to open the sidebar on small screens -->

    <v-btn
      style="font-weight: 500; font-family: 'poppins'; text-transform: lowercase"
      @click="showSignInModal"
      class="hidden-sm-and-down"
    >
      <v-icon size="16">mdi-account</v-icon>Login
    </v-btn>
  </v-app-bar>
  <!-- Sidebar for small screens -->
  <v-navigation-drawer v-model="sidebar" app class="sidebar-drawer">
    <v-list nav>
      <v-list-item-group>
        <!-- Home -->
        <v-list-item
          to="/"
          prepend-icon="mdi-home"
          title="Home"
          class="sidebar-button"
          elevation="0"
          active-class="active-button"
        >
        </v-list-item>

        <!-- About -->
        <v-list-item
          to="/about"
          prepend-icon="mdi-comment-quote"
          title="Create Feedback"
          elevation="0"
          active-class="active-button"
        >
        </v-list-item>

        <!-- Sign Up -->

        <!-- Login -->
        <v-list-item
          @click="showSignInModal"
          prepend-icon="mdi-account"
          title="Login"
          elevation="0"
          active-class="active-button"
        >
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
  <v-alert ref="loginSuccessAlert" type="success" dismissible v-model="loginSuccessAlertVisible">
    Login Successful!
  </v-alert>

  <v-alert
    ref="registerSuccessAlert"
    type="success"
    dismissible
    v-model="registerSuccessAlertVisible"
  >
    Registration Successful!
  </v-alert>

  <!-- Sign In Modal -->
  <v-dialog v-model="signInModal" max-width="600px">
    <v-card style="border-radius: 2px" elevation="4">
      <v-card-title class="text-center" style="font-weight: 800">Sign In</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="signIn">
          <input type="hidden" name="csrfmiddlewaretoken" :value="csrfToken" />
          <v-text-field
            v-model="signInData.email"
            label="Email"
            required
            variant="outlined"
          ></v-text-field>
          <v-text-field
            v-model="signInData.password"
            label="Password"
            type="password"
            required
            variant="outlined"
          ></v-text-field>
          <!-- Login button with loading state -->
          <v-btn
            :loading="loading"
            type="submit"
            style="
              border-radius: 2px;
              width: 100%;
              text-transform: lowercase;
              background: green;
              color: white;
            "
          >
            <v-icon left style="margin: 3px">mdi-login</v-icon>
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="signUpModal" max-width="600px">
  <v-card style="border-radius: 2px" elevation="4">
    <v-card-title class="text-center" style="font-weight: 800; background: green; color: white"
      >Report for a lost Item</v-card-title
    >
    <v-card-text>
      <v-form @submit.prevent="signUp" enctype="multipart/form-data">
        <input type="hidden" name="csrfmiddlewaretoken" :value="csrfToken" />
        <v-text-field
          v-model="signUpData.name"
          label="Name of Item"
          required
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="signUpData.description"
          label="Description"
          type="text"
          required
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="signUpData.location"
          label="Location"
          required
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="signUpData.date_found"
          label="Lost Date"
          type="date"
          required
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="signUpData.owner"
          label="Owner"
          required
          variant="outlined"
        ></v-text-field>
        <!-- Display the image path -->
        <img v-if="signUpData.image" :src="signUpData.image" alt="Uploaded Image" style="max-width: 100%; margin-bottom: 10px;">
        <!-- Add image field -->
        <v-file-input
          v-model="signUpData.image"
          label="Upload Image"
          outlined
          variant="outlined"
        ></v-file-input>
        <!-- Add status field -->
        <v-text-field
          v-model="signUpData.status"
          required
          value="lost"
          type="hidden"
        ></v-text-field>

        <v-btn
          :loading="loading"
          type="submit"
          style="
            border-radius: 2px;
            width: 100%;
            text-transform: lowercase;
            background: green;
            color: white;
          "
        >
          <v-icon left style="margin: 3px">mdi-link</v-icon> Submit
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-dialog>

</template>
<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      csrfToken: null,
      loginSuccessAlertVisible: false,
      registerSuccessAlertVisible: false,
      loading: false,
      sidebar: false,
      scrolled: false,
      isAuthenticated: false,
      signInModal: false,
      signUpModal: false,
      signUpData: {
        name: '',
        description: '',
        location: '',
        date_found: '',
        owner: '',
        image: null, // Initialize image field
        status: '' // Initialize status field
      },
      signInData: {
        email: '',
        password: ''
      },
      currentLanguage: 'en'
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.fetchCSRFToken() // Fetch CSRF token when the component is mounted
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 50
    },
    showSignInModal() {
      this.signInModal = true
    },
    showSignUpModal() {
      this.signUpModal = true
    },
    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === 'english' ? 'pokomo' : 'english'
    },

    fetchCSRFToken() {
      axios
        .get('http://127.0.0.1:8000/api/csrf/')
        .then((response) => {
          this.csrfToken = response.data.csrfToken
        })
        .catch((error) => {
          console.error('Failed to fetch CSRF token:', error)
        })
    },

    signInWithGoogle() {
      // Implementation for signing in with Google
    },

    signIn() {
      this.loading = true

      // Include CSRF token in the request headers
      const headers = {
        'X-CSRFToken': this.csrfToken
      }

      axios
        .post('http://127.0.0.1:8000/api/login/', this.signInData, { headers })
        .then((response) => {
          // Handle successful login
          console.log('Login successful:', response.data)

          // Save token to local storage
          localStorage.setItem('token', response.data.token)

          // Redirect to the dashboard
          window.location.href = '/dashboard' // Change '/admin' to the URL of your admin page
        })
        .catch((error) => {
          // Handle login error
          console.error('Login failed:', error.response.data)
        })
        .finally(() => {
          this.loading = false
        })
    },

    signUp() {
      this.loading = true

      // Format the date to match the expected format
      this.signUpData.date_found = this.formatDate(this.signUpData.date_found)

      // Create FormData object to send file data
      let formData = new FormData()
      formData.append('name', this.signUpData.name)
      formData.append('description', this.signUpData.description)
      formData.append('location', this.signUpData.location)
      formData.append('date_found', this.signUpData.date_found)
      formData.append('owner', this.signUpData.owner)
      formData.append('image', this.signUpData.image) // Append image as file
      formData.append('status', this.signUpData.status)

      // Include CSRF token in the request headers
      const headers = {
        'X-CSRFToken': this.csrfToken,
        'Content-Type': 'multipart/form-data' // Set content type for file upload
      }

      axios
        .post('http://127.0.0.1:8000/api/lostitems/', formData, { headers })
        .then((response) => {
          // Handle successful registration
          console.log('Registration successful:', response.data)
          this.registerSuccessAlertVisible = true
        })
        .catch((error) => {
          // Handle registration error
          console.error('Registration failed:', error.response.data)
        })
        .finally(() => {
          this.loading = false
        })
    },

    formatDate(date) {
      // Format the date to YYYY-MM-DD
      return date.toISOString().split('T')[0]
    },

    handleImageUpload(event) {
      // Capture the first file from the event
      const file = event.target.files[0]
      this.signUpData.image = file // Set the image data in the signup data object
    }
  },

  watch: {
    $route(to, from) {
      this.signInModal = false
      this.signUpModal = false
    }
  }
}
</script>

<style>
.sidebar-button {
  text-align: left;
  width: 97%;
  margin: 4px;
}
.active-button {
  color: green !important;
  background: green;
}

.logo-title-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 50px; /* Adjust the height as needed */
  margin-right: 10px; /* Add some margin between logo and title */
}
.lowercase {
  text-transform: lowercase;
}

.sidebar-drawer {
  background-color: #282c34; /* Change to your desired background color */
}

.sidebar-item {
  color: black; /* Change to your desired text color */
}

.sidebar-item:hover {
  background-color: #3d4451; /* Change to your desired hover color */
}
.newsletter-subscribe {
  color: #313437;
  padding: 50px 0;
  background: #313437;
  border-radius: 180px 180px 0px 0px;
}

.newsletter-subscribe p {
  color: #7d8285;
  line-height: 1.5;
}

.newsletter-subscribe h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 25px;
  line-height: 1.5;
  padding-top: 0;
  margin-top: 0;
  color: inherit;
}

.newsletter-subscribe .intro {
  font-size: 16px;
  max-width: 500px;
  margin: 0 auto 25px;
}

.newsletter-subscribe .intro p {
  margin-bottom: 35px;
}

.newsletter-subscribe form {
  justify-content: center;
}

.newsletter-subscribe form .form-control {
  background: #eff1f4;
  border: none;
  border-radius: 3px;
  box-shadow: none;
  outline: none;
  color: inherit;
  text-indent: 9px;
  height: 45px;
  margin-right: 10px;
  min-width: 250px;
}

.newsletter-subscribe form .btn {
  padding: 16px 32px;
  border: none;
  background: none;
  box-shadow: none;
  text-shadow: none;
  opacity: 0.9;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 13px;
  letter-spacing: 0.4px;
  line-height: 1;
}

.newsletter-subscribe form .btn:hover {
  opacity: 1;
}

.newsletter-subscribe form .btn:active {
  transform: translateY(1px);
}

.newsletter-subscribe form .btn-primary {
  background-color: #055ada !important;
  color: #fff;
  outline: none !important;
}

.down-logo {
  margin-left: -82px;
}
.header-info {
  font-size: 14px;
  color: black; /* Adjust color as needed */
  display: flex;
  align-items: center;
  padding-left: 20px;
  background: gold;
}

.custom-divider {
  width: 2px;
  height: 40px; /* Adjust height as needed */
  background-color: black;
  margin: 0 5px;
}
p {
  font-size: 19px;
  text-decoration: none;
}
@media (max-width: 880px) {
  .down-logo {
    margin-left: 0px;
  }
  .newsletter-subscribe {
    color: #313437;
    padding: 50px 0;
    background: #313437;
    border-radius: 18px 18px 0px 0px;
  }
}
</style>
