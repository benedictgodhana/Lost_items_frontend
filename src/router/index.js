import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminDashboard from '../views/Admin/dashboard.vue'
import AdminManageClaimedItems from '../views/Admin/ManageClaimedItems.vue'
import AdminManageLostItems from '../views/Admin/ManageLostItems.vue'
import AdminManageUser from '../views/Admin/ManageUser.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true } // Add meta field for authentication
    },
    {
      path: '/admin/manage-lost-items',
      name: 'manage-lost-items',
      component: AdminManageLostItems,
      meta: { requiresAuth: true } // Add meta field for authentication
    },
    {
      path: '/admin/manage-claimed-items',
      name: 'manage-claimed-items',
      component: AdminManageClaimedItems,
      meta: { requiresAuth: true } // Add meta field for authentication
    },
    {
      path: '/admin/manage-users',
      name: 'manage-users',
      component: AdminManageUser,
      meta: { requiresAuth: true } // Add meta field for authentication
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page if authentication is required but user is not authenticated
    next('/')
  } else {
    next()
  }
})

// Automatically log out user when token is deleted from local storage
window.addEventListener('storage', (event) => {
  if (event.key === 'token' && event.newValue === null) {
    // Redirect to login page
    router.push('/')
  }
})

export default router
