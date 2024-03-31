<template>
  <div>
    <Navbar></Navbar>

    <!-- Add search input -->

    <v-carousel height="600" :show-arrows="false" hide-delimiters>
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

    <v-container>
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
      <v-row>
        <v-col v-for="(item, index) in displayedLostItems" :key="item.id" cols="12" sm="6" md="4">
          <v-card variant="outlined" elevation="4">
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
              <strong>Description:</strong>{{ item.description }}<br />
              <strong>Location:</strong> {{ item.location }} <br />
              <strong>Status:</strong> {{ item.status }} <br />
              <strong>Owner:</strong>{{ item.owner }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="white"
                @click="openClaimForm(item)"
                style="background: green; text-transform: lowercase; width: 100%"
              >
                <v-icon>mdi-check</v-icon>Claim</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="filteredLostItems.length > displayedLostItems.length">
        <v-col cols="12" class="text-center">
          <v-btn
            @click="viewAll"
            width="100%"
            style="text-transform: capitalize; background: green; color: white"
            ><v-icon>mdi-eye</v-icon>View All</v-btn
          >
        </v-col>
      </v-row>
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
        <v-card-title>Claim Form</v-card-title>
        <v-card-text>
          <!-- Your claim form fields here -->
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="claimDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitClaim">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <Footer />
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
    const lostItems = ref([])
    const dialog = ref(false)
    const dialogImage = ref('')
    const searchQuery = ref('')
    const displayedLostItems = ref([])
    const claimDialog = ref(false)

    onMounted(async () => {
      try {
        const response = await axiosInstance.get('/lostitems/')
        lostItems.value = response.data
        // Initially display first 6 items
        displayedLostItems.value = lostItems.value.slice(0, 6)

        // Fetch owner names for all items
        await fetchOwnerNames()
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
          item.status.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          item.ownerName.toLowerCase().includes(searchQuery.value.toLowerCase()) // Search by owner name
      )
    })

    const showImageDialog = (imageSrc) => {
      dialogImage.value = imageSrc
      dialog.value = true
    }

    const openClaimForm = (item) => {
      // Show claim form dialog
      claimDialog.value = true
    }

    const viewAll = () => {
      // Display all filtered lost items
      displayedLostItems.value = [...filteredLostItems.value]
    }

    const submitClaim = () => {
      // Handle claim submission
    }

    // Fetch owner names for all items

    return {
      displayedLostItems,
      dialog,
      dialogImage,
      showImageDialog,
      searchQuery,
      openClaimForm,
      viewAll,
      claimDialog,
      filteredLostItems,
      submitClaim
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
