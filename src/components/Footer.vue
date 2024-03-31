<!-- Footer.vue -->
<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Logo -->
        <div class="logo">
          <img src="" alt="" />
        </div>
        <!-- Contact Information -->
        <div class="contact">
          <h4>Contact Us</h4>
          <ul>
            123 Main Street
          </ul>
          <ul>
            City, Country
          </ul>
          <ul>
            Email: info@example.com
          </ul>
          <ul>
            Phone: +1234567890
          </ul>
        </div>
        <!-- Quick Links -->
        <div class="quick-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: green;
  color: white;
  text-align: center;
  padding: 20px 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.logo img {
  max-width: 100px; /* Adjust size as needed */
}

.contact,
.quick-links {
  flex: 1;
  margin: 0 20px;
}

.quick-links ul {
  list-style: none;
  padding: 0;
}

.quick-links ul li {
  margin-bottom: 10px;
}

.quick-links ul li a {
  color: white;
  text-decoration: none;
}

.quick-links ul li a:hover {
  text-decoration: underline;
}
</style>
