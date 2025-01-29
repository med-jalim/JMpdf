import { createClient } from '@supabase/supabase-js';
import {loadHeader} from './function'

// استبدل هذه القيم بالمفاتيح الخاصة بك
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// الآن يمكنك استخدام `supabase` للتفاعل مع قاعدة البيانات


async function fetchCategorys() {
    const categorysList = document.getElementById('categorys-list');
    if (categorysList){
    const { data, error } = await supabase.from('category').select('*');
    if (error) {
      console.error('Error fetching category:', error);
      return;
    }
    displayCategory(data);
  };
  }

  
  function displayCategory(categorys) {
    const categorysList = document.getElementById('categorys-list');
    categorysList.innerHTML = ''; // تفريغ المحتوى الحالي
  
    categorys.forEach(category => {
      if(category.id===0){
        return
      }
      const categorysItem = document.createElement('div');
      categorysItem.classList.add('categorys-item','bg-primary','mb-2','p-2','rounded-3',);
  
      categorysItem.innerHTML = `
        <div class="category-info text-center text-uppercase text-white   ">
          <h5><a class="nav-link" href='booksCategory.html?category=${encodeURIComponent(category.name)}'>${category.name}</a></h5>
        </div>
      `;
  
      categorysList.appendChild(categorysItem);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadHeader()
    fetchCategorys();
  });
  







