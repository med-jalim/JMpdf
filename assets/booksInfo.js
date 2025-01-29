import { createClient } from '@supabase/supabase-js';

        // استبدل هذه القيم بالمفاتيح الخاصة بك
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        async function loadBook() {
            const urlParams = new URLSearchParams(window.location.search);
            const title = urlParams.get('title');
            document.title=`${title}`
            console.log(title)
            
            if (!title) {
                console.error('No book provided');
                return;
            }

            document.getElementById('book-title').textContent = `${title}`;

            const { data: books, error } = await supabase
                .from('books')
                .select('*')
                .eq('title', title);
                
            if (error) {
                console.error('Error fetching book:', error);
                return;
            } ;
            let book=books[0]

            const divImg = document.getElementById('book-img')
            const divDisc = document.getElementById('disc')
            const divBtn = document.getElementById('download')

            divImg.innerHTML=`
                <img class='img-fluid ' src="${book.img}" alt="" id="img">
            `

            divDisc.innerHTML=`
                <p class="text-center text-md-end">${book.description}</p>
            `

            divBtn.innerHTML=`
                <a href='${book.download_link}' class='btn btn-primary ' >Download</a>
            `

            
            
        }

        document.addEventListener('DOMContentLoaded', loadBook);