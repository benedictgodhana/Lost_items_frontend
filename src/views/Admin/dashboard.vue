<template>
  <div>
    <!-- Navigation bar -->
    <AdminNavbar></AdminNavbar>

    <!-- Sidebar -->
    <AdminSidebar :sidebar="sidebar" @toggle-sidebar="toggleSidebar" />

    <!-- Flex container for count cards -->
    <div class="count-cards-container">

        <LostItemCard :count="lostItemCount" />
        <UserCountCard :count="UserCountCard" />

      <!-- Cards displaying the counts -->
      
    </div>
  </div>
</template>

<script>
// import AdminSidebar from '@/components/AdminSidebar.vue'
import AdminNavbar from '@/components/AdminNavbar.vue'
import AdminSidebar from '@/components/AdminSiderbar.vue'
import UserCountCard from '@/components/UserCount.vue'
import LostItemCard from '@/components/LostItemsCount.vue'
//   import EmployeeCountCard from '@/components/EmployeeCountCard.vue';
//   import CustomerCountCard from '@/components/CustomerCountCard.vue';
//   import ServiceCountCard from '@/components/ServiceCountCard.vue';
//   import PaymentCountCard from '@/components/PaymentCountCard.vue';

export default {
  components: {
    AdminNavbar,
    AdminSidebar,
    LostItemCard,
    UserCountCard
    // EmployeeCountCard,
    // CustomerCountCard,
    // ServiceCountCard,
    // PaymentCountCard
  },
  data() {
    return {
      sidebar: true, // Initialize the sidebar as open
      userCount: 100, // Example user count data
      employeeCount: 50, // Example employee count data
      customerCount: 200, // Example customer count data
      serviceCount: 10, // Example service count data
      paymentCount: 1000 // Example service count data
    }
  },
  methods: {
    toggleSidebar() {
      // Method to toggle the sidebar
      this.sidebar = !this.sidebar
    }
  }
}
</script>

<style scoped>
/* Flex container for count cards */
.count-cards-container {
  display: flex;
  margin-left: 10px;
  margin-top: 20px; /* Optional margin */
}
</style>
