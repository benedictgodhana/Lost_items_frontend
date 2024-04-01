<template>
  <v-navigation-drawer v-model="sidebar" app class="sidebar-drawer" style="background-color: white">
    <v-list nav>
      <!-- Dashboard -->
      <v-list-item
        to="/dashboard"
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        color="white"
        elevation="0"
        active-class="active-button"
      >
      </v-list-item>

      <!-- Manage Lost Items -->
      <v-list-item
        to="/admin/manage-lost-items"
        prepend-icon=" mdi-laptop"
        color="white"
        title="Manage Lost Items"
        elevation="0"
        active-class="active-button"
      >
      </v-list-item>

      <v-list-item
        to="/admin/manage-claimed-items"
        prepend-icon=" mdi-laptop"
        color="white"
        title="Manage Claimed Items"
        elevation="0"
        active-class="active-button"
      >
      </v-list-item>

      <!-- Manage Users -->
      <v-list-item
        to="/admin/manage-users"
        prepend-icon="mdi-account-group"
        color="white"
        title="Manage Users"
        elevation="0"
        active-class="active-button"
      >
      </v-list-item>

      <!-- Reports -->
      <v-list-item
        to="/admin/reports"
        prepend-icon="mdi-file-chart"
        color="white"
        title="Reports"
        elevation="0"
        active-class="active-button"
      >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      sidebar: true // Set sidebar to be open by default
    }
  }
}
</script>

<style scoped>
.sidebar-button {
  text-align: left;
  font-weight: 500;
  font-family: 'Poppins';
}

.active-button {
  color: blue; /* Customize active button color */
  background: green;
}
</style>
