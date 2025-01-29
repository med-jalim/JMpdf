import { createClient } from '@supabase/supabase-js';
import {fetchdata} from './function'


// استبدل هذه القيم بالمفاتيح الخاصة بك
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// الآن يمكنك استخدام `supabase` للتفاعل مع قاعدة البيانات

document.addEventListener('DOMContentLoaded',  async () => {
  const headerLinks=document.querySelectorAll('.headerLink')


    fetchdata(supabase,'books');

    let data =await fetchdata(supabase,'books','pdf',true,true)
    document.getElementById('searchHomePage').addEventListener('input', async (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredata = data.filter(d => 
          d.title.toLowerCase().includes(searchTerm) ||
          d.description.toLowerCase().includes(searchTerm) ||
          d.categoryName.toLowerCase().includes(searchTerm)
      );
      fetchdata(supabase,'books','pdf',filteredata);
  });


});




  







