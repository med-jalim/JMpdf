import { createClient } from '@supabase/supabase-js';
        import { fetchdata } from './function'

        // استبدل هذه القيم بالمفاتيح الخاصة بك
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        
            const urlParams = new URLSearchParams(window.location.search);
            const categoryName = urlParams.get('category');

            document.title=`${categoryName}`

            document.getElementById('category-title').textContent = `${categoryName} books`;

        document.addEventListener('DOMContentLoaded', 
            fetchdata(supabase,'books','pdf in this category',true,false,undefined,['categoryName',categoryName])
      );