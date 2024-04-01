<template>
  <div>
    <!-- Navbar component -->
    <Navbar></Navbar>

    <!-- Carousel -->
    <v-carousel height="600" :show-arrows="false" hide-delimiters>
      <!-- Carousel item -->
      <v-carousel-item src="/Curious-rafiki.png">
        <!-- Darkened image with overlay text -->
        <div class="darkened-image">
          <!-- Overlay text -->
          <div class="overlay-text">
            <h1>Welcome to Our Lost Items Platform</h1>
            <p>Discover lost items and help reunite them with their owners.</p>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>

    <!-- Container -->
    <v-container>
      <!-- Search input -->
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="searchQuery"
            label="Search lost items"
            variant="outlined"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>

      <v-alert v-if="claimSubmissionStatus" :value="true" type="success" style="margin-top: 10px">
        Claim submitted successfully!
      </v-alert>
      <br />

      <!-- Display lost items -->
      <v-row>
        <v-col v-for="(item, index) in displayedLostItems" :key="item.id" cols="12" sm="6" md="4">
          <v-card variant="outlined" elevation="4" style="border-radius: 10px">
            <!-- Display the image -->
            <v-img
              :src="item.image"
              height="200"
              style="border-radius: 0px"
              cover
              @click="showImageDialog(item.image)"
            ></v-img>
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-text>
              <strong>Location:</strong> {{ item.location }} <br />
              <strong>Date Found:</strong> {{ item.date_found }} <br />
              <strong>Status:</strong> {{ item.status }} <br />
            </v-card-text>
            <v-card-actions>
              <!-- Claim button -->
              <v-btn
                color="white"
                @click="openClaimForm(item)"
                style="background: green; text-transform: lowercase; width: 100%"
              >
                <v-icon>mdi-check</v-icon>Claim
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- View all button -->
      <v-row v-if="filteredLostItems.length > displayedLostItems.length">
        <v-col cols="12" class="text-center">
          <v-btn
            @click="viewAll"
            width="100%"
            style="text-transform: capitalize; background: green; color: white"
          >
            <v-icon>mdi-eye</v-icon>View All
          </v-btn>
        </v-col>
      </v-row>

      <!-- No lost items message -->
      <div v-else-if="filteredLostItems.length === 0">
        <p>No lost items found.</p>
      </div>
    </v-container>

    <!-- Image dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-img :src="dialogImage"></v-img>
        <v-card-actions>
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Claim form dialog -->
    <v-dialog v-model="claimDialog" max-width="500px">
      <v-card>
        <!-- Claim form title with selected item name -->
        <v-card-title class="text-center" style="background: green; color: white"
          >Claim Form {{ selectedItem.name }}</v-card-title
        >
        <v-card-text>
          <!-- Claim form fields -->
          <v-text-field v-model="claimantName" label="Your Name" variant="outlined"></v-text-field>
          <v-text-field
            v-model="claimantContact"
            label="Contact Information"
            variant="outlined"
          ></v-text-field>
          <v-textarea
            v-model="claimDescription"
            label="Description of Claim"
            variant="outlined"
          ></v-textarea>

          <v-checkbox v-model="isVerified" label="Confirm claim verification"></v-checkbox>
        </v-card-text>

        <v-card-actions>
          <!-- Cancel and Submit buttons -->
          <v-btn
            color="white"
            text
            @click="claimDialog = false"
            style="background: red; text-transform: capitalize"
            >Cancel</v-btn
          >
          <v-btn
            color="white"
            @click="submitClaim"
            style="background: green; text-transform: capitalize"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Footer component -->
    <Footer />
  </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue'
import axiosInstance from '../service/api'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Navbar,
    Footer
  },
  setup() {
    const claimSubmissionStatus = ref(false)
    const isVerified = ref(false) // Initially set to false
    // Define reactive variables
    const lostItems = ref([])
    const dialog = ref(false)
    const dialogImage = ref('')
    const searchQuery = ref('')
    const displayedLostItems = ref([])
    const claimDialog = ref(false)
    const claimantName = ref('')
    const claimantContact = ref('')
    const claimDescription = ref('')
    const claimError = ref('')
    const selectedItem = ref(null)

    // Fetch lost items from the API on component mount
    onMounted(async () => {
      try {
        const response = await axiosInstance.get('/lostitems/')
        lostItems.value = response.data
        // Initially display first 6 items
        displayedLostItems.value = lostItems.value.slice(0, 6)
      } catch (error) {
        console.error('Error fetching lost items:', error)
      }
    })

    // Filter lost items based on search query
    const filteredLostItems = computed(() => {
      return lostItems.value.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.status.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    // Show image dialog with the clicked image
    const showImageDialog = (imageSrc) => {
      dialogImage.value = imageSrc
      dialog.value = true
    }

    // Open claim form dialog with the selected item
    const openClaimForm = (item) => {
      selectedItem.value = item
      claimDialog.value = true
    }

    // Display all filtered lost items
    const viewAll = () => {
      displayedLostItems.value = [...filteredLostItems.value]
    }

    // Submit claim form data
    const submitClaim = async () => {
      try {
        // Make POST request to submit claim
        const response = await axiosInstance.post('/claims/', {
          lost_item: selectedItem.value.id,
          claimant_name: claimantName.value,
          claimant_contact: claimantContact.value,
          description: claimDescription.value,
          is_verified: isVerified.value // Include is_verified field in the request
        })

        // Handle successful claim submission
        console.log(response.data)

        // Check if the claim was successfully verified
        if (response.data.is_verified) {
          // Set is_verified to true in the claim object
          selectedItem.value.is_verified = true
        }

        claimSubmissionStatus.value = true

        // Automatically hide the alert after 4 seconds
        setTimeout(() => {
          claimSubmissionStatus.value = false
        }, 4000)
        // Close claim form dialog
        claimDialog.value = false
      } catch (error) {
        // Handle claim submission error
        console.error('Error submitting claim:', error.response.data)
        claimError.value = error.response.data.error || 'Failed to submit claim'
      }
    }

    // Method to update is_verified when checkbox changes
    const updateIsVerified = () => {
      if (isVerified.value) {
        // Checkbox is checked, set is_verified to true
        isVerified.value = true
      }
    }

    // Return reactive variables and functions
    return {
      claimSubmissionStatus,
      displayedLostItems,
      dialog,
      dialogImage,
      searchQuery,
      claimDialog,
      filteredLostItems,
      claimantName,
      claimantContact,
      claimDescription,
      claimError,
      selectedItem,
      showImageDialog,
      openClaimForm,
      viewAll,
      submitClaim,
      updateIsVerified // Include the updateIsVerified method in the return object
    }
  }
}
</script>

<style scoped>
.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

.overlay-text h1 {
  font-size: 2.5rem;
}

.overlay-text p {
  font-size: 1.2rem;
}

/* Apply overlay to darken the image */
.darkened-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Adjust opacity as needed */
}
</style>
