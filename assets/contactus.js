import { createClient } from '@supabase/supabase-js';
import {insertData,loadHeader} from './function';

// استبدل هذه القيم بالمفاتيح الخاصة بك
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);









document.addEventListener('DOMContentLoaded', function() {
  loadHeader()

    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
      };
      
      // Create success message
      const successAlert = document.createElement('div');
      successAlert.className = 'alert alert-success';
      successAlert.innerHTML = `
        <h4 class="alert-heading">Thank you for reaching out!</h4>
        <p>We've received your message and will get back to you within 24 hours.</p>
      `;
      
      // Insert success message before the form
      form.parentNode.insertBefore(successAlert, form);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        successAlert.remove();
      }, 5000);
      
      // Reset form
      form.reset();
      
      // Log form data (replace with your API call)
      console.log('Form submitted:', formData);
      insertData(supabase,'usersmessages',true,formData)
    });
    
    
  });