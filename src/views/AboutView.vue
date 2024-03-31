<template>
  <div>
    <Navbar></Navbar>

    <!-- Add search input -->

    <div class="carousel-container">
      <!-- Carousel -->
      <v-carousel height="1000" :show-arrows="false" hide-delimiters>
        <v-carousel-item src="/Curious-rafiki.png">
          <!-- Darkened image with overlay text -->
          <div class="darkened-image">
            <!-- Overlay text -->
            <div class="overlay-text">
              <h1>Report your lost item</h1>
              <p>Help reunite lost items with their owners by reporting them here.</p>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>

      <!-- Lost Item Claim Form Overlay -->
      <div>
        <v-card
          class="overlay-form"
          width="100%"
          elevation="0"
          variant="outlined"
          style="max-width: 700px"
        >
          <v-card-title>Report Lost Item</v-card-title>
          <v-card-text>
            <!-- Lost item claim form -->
            <v-form>
              <v-text-field
                v-model="lostItem.name"
                label="Name"
                required
                variant="outlined"
              ></v-text-field>
              <v-textarea
                v-model="lostItem.description"
                label="Description"
                required
                variant="outlined"
              ></v-textarea>
              <v-text-field
                v-model="lostItem.location"
                label="Location"
                required
                variant="outlined"
              ></v-text-field>
              <!-- Add more fields as needed -->
              <v-text-field
                v-model="lostItem.date_found"
                label="Date Found"
                required
                variant="outlined"
                type="date"
              ></v-text-field>
              <v-text-field
                v-model="lostItem.owner"
                label="Owner"
                required
                variant="outlined"
              ></v-text-field>
              <!-- Add more fields as needed -->
              <input type="hidden" v-model="lostItem.status" value="lost" />

              <v-file-input
                v-model="lostItem.image"
                type="file"
                label="Upload Image"
                @change="handleImageUpload"
                outlined
                variant="outlined"
                required
                ></v-file-input>


            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="white"
              @click="submitClaim"
              style="background: green; text-transform: capitalize"
              >Submit</v-btn
            >
            <v-btn
              color="white"
              @click="claimDialog = false"
              style="background: red; text-transform: capitalize"
              >Cancel</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Navbar,
    Footer
  },
  setup() {
    const claimDialog = ref(false)
    const lostItem = ref({
      name: '',
      description: '',
      location: '',
      image: '',
      date_found: '',
      owner: '',
      status: ''

      // Add other fields as needed
    })

    const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    lostItem.value.image = file;
  }
};



    const openClaimFormDialog = () => {
      // Open the claim form dialog
      claimDialog.value = true
    }

    const submitClaim = async () => {
  try {
    const formData = new FormData();
    formData.append('name', lostItem.value.name);
    formData.append('description', lostItem.value.description);
    formData.append('location', lostItem.value.location);
    formData.append('date_found', lostItem.value.date_found);
    formData.append('owner', lostItem.value.owner);
    formData.append('status', lostItem.value.status);
    formData.append('image', lostItem.value.image);

    const response = await axios.post('http://127.0.0.1:8000/api/lostitems/', formData);

    console.log('Submitted Lost Item:', response.data);

    lostItem.value = {
      name: '',
      description: '',
      location: '',
      date_found: '',
      owner: '',
      image: '',
      status: ''
    };

    claimDialog.value = false;
  } catch (error) {
    console.error('Error submitting lost item:', error);
  }
};


    return {
      claimDialog,
      lostItem,
      openClaimFormDialog,
      submitClaim
    }
  }
}
</script>

<style scoped>
.carousel-container {
  position: relative;
}

.overlay-form {
  position: absolute;
  left: 110px; /* Adjust left positioning as needed */
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000; /* Ensure the overlay is above the carousel */
}

.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  padding-left: 430px;
  text-transform: capitalize;
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
